import SharedSpeech from "./types/SharedSpeech";
import Language from "../constants/language";

let _sharedSpeech:SharedSpeech;

function _createSharedSpeech():SharedSpeech {
  const sharedSpeech:SharedSpeech = {};
  sharedSpeech[Language.SPANISH] = {
    doYouKnowIt: '¿Lo sabes?',
    doYouUnderstand: '¿Me entiendes?',
    questions: 'Preguntas',
    repeatTheLessonAgain: '¿Quieres que repita la lección?',
    shallIRepeat: '¿Quieres que repita?',
    theStory: 'El Cuento',
    vocabulary: 'Vocabulario',
  };
  return sharedSpeech;
}

export function getSharedSpeech(language:Language) {
  if (!_sharedSpeech) _sharedSpeech = _createSharedSpeech();
  return _sharedSpeech[language];
}