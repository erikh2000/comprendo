import Language from './constants/language';
import CefrLevel from './constants/cefrLevel';
import { ask, askJson } from './openAiUtil';
import WordExplanation from "./lessonGenerators/types/WordExplanation";
import ComprehensionQuestionAndAnswer from "./lessonGenerators/types/ComprehensionQuestionAndAnswer";

export async function generateStory(topic:string, wordCount:number, language:Language, cefrLevel:CefrLevel, includeVocabulary?:string[], includeGrammar?:string) {
  let prompt = `Create a story of about ${wordCount} words in ${cefrLevel} level ${language}.` + 
    ` The story should be about ${topic}.` +  
    ` Avoid use of vocabulary that a native speaker is unlikely to use in a normal day of conversation.`;
  if (includeVocabulary) { prompt += ` The story should include the following words, which may be conjugated or otherwise altered to fit grammar: ${includeVocabulary.join(', ')}.`; }
  if (includeGrammar) { prompt += ` The story should include the following grammar: ${includeGrammar}.`; }
  return await ask(prompt);
}

export async function findLeastCommonWords(text:string, wordCount:number, language:Language, cefrLevel:CefrLevel):Promise<string[]> {
  let prompt = `Text:${text}\n` +
    `In the previous text what are the ${wordCount} most likely words to be unfamiliar to a ${cefrLevel} level ${language} learner?\n` +
    `Output in the following form:\n` +
    `{ "words":["spanish word", ...] }`;
  const response = await askJson(prompt);
  return (response as any).words ?? [];
}

export async function generateWordExplanation(word:string, language:Language, cefrLevel:CefrLevel):Promise<WordExplanation> {
  let prompt = `For the ${language} word "${word}", output in the following form:\n` +
    `{\n` +
	  `  "spanishExample":"a short sentence in ${cefrLevel} ${language} using the word '${word}' in a typical way that gives context”,\n` +
	  `  "englishDefinition":"a short definition of the word '${word}' in English. Include no text beyond the definition itself."\n` +
    `}`;
  const wordExplanation = await askJson(prompt);
  return wordExplanation as WordExplanation;
}

export async function generateComprehensionQuestions(text:string, questionCount:number, language:Language, cefrLevel:CefrLevel):Promise<ComprehensionQuestionAndAnswer[]> {
  let prompt = `Text:${text}\n` +
    `Generate ${questionCount} questions that test comprehension of the previous text. Output in the following form:\n` +
    `{ "questions": [\n` +
    `  {\n` +
    `    "question": "a question in ${cefrLevel} level ${language} about the text that has a simple answer of 3 words or less",\n` +
    `    "answer": "the shortest answer in ${language} that remains correct and only uses words from the text",\n` +
    `    "sentenceAnswer": "the answer as a short but complete sentence in ${language} that only uses words from the text",\n` +
    `    "englishAnswer": "the answer as a short but complete sentence in English"\n` +
    `  },\n` +
    `  ...\n` +
    `] }`;
  const response = await askJson(prompt);
  return (response as any).questions ?? [];
}

export async function generateLessonName(topic:string, language:Language, cefrLevel:CefrLevel):Promise<string> {
  let prompt = `Create a story title based on the following topic: "${topic}". ` +
    `Output in the following format: { "title": "title with less than 6 words in ${cefrLevel} level ${language}"}`;
  const response = await askJson(prompt);
  return (response as any).title ?? '';
}