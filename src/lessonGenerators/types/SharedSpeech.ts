type SharedSpeechByLanguage = {
  doYouKnowIt:string;
  doYouUnderstand:string;
  questions:string;
  repeatTheLessonAgain:string;
  shallIRepeat:string;
  theStory:string;
  vocabulary:string;
}
  
type SharedSpeech = {
  [language:string]:SharedSpeechByLanguage
};

export default SharedSpeech;