import ComprehensionLesson, {WordExplanations} from "./types/ComprehensionLesson";
import {
  findLeastCommonWords,
  generateComprehensionQuestions,
  generateLessonName,
  generateStory,
  generateWordExplanation
} from "../prompts";
import CefrLevel from "../constants/cefrLevel";
import Language from "../constants/language";
import {generateSpeech, SpeechUrls} from "../comprendoServiceClient";
import SsmlGenerator, {CURRENT_SECTION, EXIT, FIRST_LINE, NEXT_LINE} from "../ssml/SsmlGenerator";
import {getSharedSpeech} from "./sharedSpeech";

const STORY_WORD_COUNT = 100;
const UNCOMMON_WORD_COUNT = 8;
const QUESTION_COUNT = 5;

async function _generateWordExplanations(words:string[], language:Language, cefrLevel:CefrLevel):Promise<WordExplanations> {
  const wordExplanations:WordExplanations = {};
  for(let wordI = 0; wordI < words.length; ++wordI) {
    const word = words[wordI];
    wordExplanations[word] = await generateWordExplanation(word, language, cefrLevel);
  }
  return wordExplanations;
}

export async function generateComprehensionLesson(topic:string, language:Language, cefrLevel:CefrLevel, 
    includeVocabulary?:string[], includeGrammar?:string):Promise<ComprehensionLesson> {
  const name = await generateLessonName(topic, language, cefrLevel);
  const story  = await generateStory(topic, STORY_WORD_COUNT, language, cefrLevel, includeVocabulary, includeGrammar);
  const uncommonWords = await findLeastCommonWords(story, UNCOMMON_WORD_COUNT, language, cefrLevel);
  const wordExplanations = await _generateWordExplanations(uncommonWords, language, cefrLevel);
  const questions = await generateComprehensionQuestions(story, QUESTION_COUNT, language, cefrLevel);
  
  return {
    name,
    story,
    wordExplanations,
    questions
  } as ComprehensionLesson;
}

function _createSsmlForLesson(lesson:ComprehensionLesson, language:Language):string {
  const ssml = new SsmlGenerator();
  const shared = getSharedSpeech(language);
  
  ssml.addSection(shared.vocabulary);
  ssml.addBreak();
  for(const word in lesson.wordExplanations) {
    const wordExplanation = lesson.wordExplanations[word];
    ssml.addLine(word);
    ssml.addBreak();
    ssml.addYesNo(shared.doYouKnowIt, +4, NEXT_LINE);
    ssml.addLine(word);
    ssml.addBreak();
    ssml.addLine(wordExplanation.spanishExample);
    ssml.addBreak();
    ssml.addHomeLanguageLine(wordExplanation.englishDefinition);
    ssml.addBreak();
  }
  
  ssml.addSection(shared.theStory);
  ssml.addBreak();
  ssml.addLine(lesson.story);
  ssml.addBreak();
  ssml.addYesNo(shared.shallIRepeat, CURRENT_SECTION, NEXT_LINE);
  
  ssml.addSection(shared.questions);
  for(const questionAndAnswer of lesson.questions) {
    ssml.addLine(questionAndAnswer.question);
    ssml.addPractice();
    ssml.addLine(questionAndAnswer.answer);
    ssml.addBreak(1);
    ssml.addLine(questionAndAnswer.sentenceAnswer);
    ssml.addYesNo(shared.doYouUnderstand, +2, NEXT_LINE);
    ssml.addHomeLanguageLine(questionAndAnswer.englishAnswer);
    ssml.addBreak(1);
  }
  
  ssml.addYesNo(shared.repeatTheLessonAgain, FIRST_LINE, EXIT);
  
  return ssml.toSsml();
}

export async function generateSpeechForComprehensionLesson(lesson:ComprehensionLesson, language:Language):Promise<SpeechUrls> {
  const ssml = _createSsmlForLesson(lesson, language);
  return await generateSpeech(ssml, lesson.name, language);
}