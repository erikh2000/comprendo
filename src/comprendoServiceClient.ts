import { callApiGateway } from "./awsApiGatewayUtil";
import { getHashed, putHashed } from "./storeUtil";
import Language, {getSpeechLanguageCode} from "./constants/language";

function _getSpeechKeyPath(language:string) { return `speech/${language}`; }

export type SpeechUrls = {
  lessonUrl:string;
};

async function _getSpeechUrls(ssml:string, language:string):Promise<SpeechUrls|null> {
  const keyPath = _getSpeechKeyPath(language);
  const result = await getHashed(keyPath, ssml);
  return result === null ? null : result as SpeechUrls;
}

async function _putSpeechUrls(ssml:string, language:string, speechUrls:SpeechUrls){
  const keyPath = _getSpeechKeyPath(language);
  await putHashed(keyPath, ssml, speechUrls);
}

export async function generateSpeech(ssml:string, name:string, language:Language):Promise<SpeechUrls> {
  const urls = await _getSpeechUrls(ssml, language);
  if (urls) return urls;
  
  const speechLanguageCode = getSpeechLanguageCode(language);
  const body = {ssml, language:speechLanguageCode, name};
  const responseObject = await callApiGateway('generateSpeech', 'POST', body);
  const speechUrls = responseObject as SpeechUrls;
  
  await _putSpeechUrls(ssml, language, speechUrls);
  return speechUrls;
}