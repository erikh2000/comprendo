import { init } from './openAiUtil';
import {getLanguageCaseInsensitive} from "./constants/language";
import {getCefrLevelCaseInsensitive} from "./constants/cefrLevel";
import {
  generateComprehensionLesson,
  generateSpeechForComprehensionLesson
} from "./lessonGenerators/comprehensionLesson";
import {getArgumentObject, InvalidCommandLineArgsError} from "./common/commandLineUtil";

async function _handleGenerateCommand(a:any) {
  if (!a) throw new InvalidCommandLineArgsError('No arguments provided.');
  if (a.help !== undefined) {
    console.log('Generates a lesson and publishes associated assets to the cloud.');
    console.log('\nUsage:');
    console.log('comprendo generate -lessonType:LESSONTYPE -topic:TOPIC -language:LANGUAGE -cefrLevel:CEFRLEVEL'); //-includeVocabulary:{word1[,word2[...wordN]]} -includeGrammar:{grammar}');
    console.log('  LESSONTYPE = "comprehension"');
    console.log('  TOPIC = any topic you want to generate a lesson for. For best results, keep it down to one sentence.');
    console.log('  LANGUAGE = "spanish" / "german" / "english"');
    console.log('  CEFRLEVEL = "a1" / "a2" / "b1" / "b2" / "c1" / "c2"');
    console.log('\nOptional parameters:');
    console.log('  -includeVocabulary:WORDS');
    console.log('  WORDS = comma-delimited list of words to include in the lesson.');
    console.log('  -includeGrammar:GRAMMAR');
    console.log('  GRAMMAR = a description of any language features you want to include in the lesson.');
    console.log('\nExample:');
    console.log('  comprendo generate -lessonType:comprehension -topic:"a man eats too much at dinner" -language:spanish -cefrLevel:a1'); 
    return;
  }
  
  const topic = a.topic ?? null;
  if (!topic) throw new InvalidCommandLineArgsError('No topic provided.');
  const language = getLanguageCaseInsensitive(a.language);
  if (!language) throw new InvalidCommandLineArgsError('No valid language provided.');
  const cefrLevel = getCefrLevelCaseInsensitive(a.cefrLevel);
  if (!cefrLevel) throw new InvalidCommandLineArgsError('No valid CEFR level provided.');
  const includeVocabulary = a.includeVocabulary ? a.includeVocabulary.split(',') : undefined;
  const includeGrammar = a.includeGrammar;
  console.log(`Generating lesson for topic: ${topic}, language: ${language}, CEFR level: ${cefrLevel}, include vocabulary: ${includeVocabulary}, include grammar: ${includeGrammar}.`);
  const comprehensionLesson = await generateComprehensionLesson(topic, language, cefrLevel, includeVocabulary, includeGrammar);
  const speechUrls = await generateSpeechForComprehensionLesson(comprehensionLesson, language);
  console.log(`Lesson has been published at ${speechUrls.lessonUrl}.`);
}

function _handleHelp() {
  console.log('C o m p r e n d o');
  console.log('A tool for generating language learning lessons. For help on a specific command: comprendo COMMAND -help\n');
  console.log('Commands: generate, help\n');
}

async function doIt(){
  init();
  try {
    const a:any = getArgumentObject();
    if (!a.command) throw new InvalidCommandLineArgsError('No command provided. "comprendo help" to list commands.');
    switch(a.command) {
      case 'generate': await _handleGenerateCommand(a); break;
      case 'help': _handleHelp(); break;
      default: throw new InvalidCommandLineArgsError(`Unknown command: ${a.command}.`);
    }
  } catch(e) {
    if (e instanceof InvalidCommandLineArgsError) {
      console.error(e.message);
    } else {
      console.error(e);
    }
  }
}

doIt().then(() => {});

export {};