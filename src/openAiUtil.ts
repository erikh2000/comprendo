import OpenAI from "openai";
import {getHashed, putHashed} from "./storeUtil";
import {OPENAI_API_KEY} from "./private/apiConfig";

let api:OpenAI|null = null;

const MODEL = 'gpt-4'; // 'gpt-3.5-turbo';

export function init() {
  api = new OpenAI({apiKey:OPENAI_API_KEY});
}

function _getPromptCacheKeyPath(model:string):string {
  return `prompt-cache/${model}`;
}

async function _getResponseFromCache(model:string, question:string):Promise<string|null> {
  const promptCacheKeyPath = _getPromptCacheKeyPath(model);
  const response = await getHashed(promptCacheKeyPath, question);
  return response === null ? null : response as string;
}

async function _putResponseInCache(model:string, question:string, response:string) {
  const promptCacheKeyPath = _getPromptCacheKeyPath(model);
  await putHashed(promptCacheKeyPath, question, response);
}

async function _ask(model:string, question:string):Promise<string> {
  if (!api) throw Error('Call init() first.');
  
  let completion:OpenAI.Chat.Completions.ChatCompletion|null = null;
  let retryDelay = 4 + (Math.random() * 2 - 1); // Random added to avoid simultaneous retries.
  const MAX_RETRIES_AFTER_RATE_LIMIT = 8;
  
  console.log('\nAsking:', question);
  for(let i = 0; i < MAX_RETRIES_AFTER_RATE_LIMIT; ++i) {
    try {
      completion = await api.chat.completions.create({
        model: MODEL,
        messages: [{role:'user', content:question}],
        max_tokens: 2000,
        n: 1
      });
    } catch(err) {
      if (!(err instanceof OpenAI.APIError) || err.status !== 429) throw err;
      console.warn(`Rate limit exceeded. Waiting ${retryDelay.toFixed(1)} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay*1000));
      retryDelay *= 2;
    }
  }
  if (!completion) throw Error('No completion from OpenAI.');
  
  const responseText = completion.choices[0].message.content;
  if (!responseText) {
    console.error(completion);
    throw Error('No response text from OpenAI.');
  }

  console.log('\nResponse:', responseText);
  return responseText;
}

export async function ask(question:string):Promise<string> {
  const response = await _getResponseFromCache(MODEL, question);
  if (response) return response;
  
  const responseText = await _ask(MODEL, question);
  
  await _putResponseInCache(MODEL, question, responseText);
  return responseText;
}

export async function askJson(question:string):Promise<object> {
  const responseText = await _getResponseFromCache(MODEL, question);
  if (responseText) {
    try {
      return JSON.parse(responseText);
    } catch(err) {
      console.warn('Cached response for question was not JSON:', question, responseText);
    }
  }
  
  const MAX_RETRIES = 2;
  for (let i = 0; i < MAX_RETRIES; ++i) {
    const responseText = await _ask(MODEL, question);
    try {
      const response = JSON.parse(responseText);
      await _putResponseInCache(MODEL, question, responseText);
      return response;
    } catch (err) {
      console.warn('Failed to parse JSON from response:', responseText);
    }
  }
  
  throw Error('Failed to parse JSON from response after retries.');
}