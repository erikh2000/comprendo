import WordExplanation from "./WordExplanation";
import ComprehensionQuestionAndAnswer from "./ComprehensionQuestionAndAnswer";

export type WordExplanations = {
  [word:string]:WordExplanation
};

type ComprehensionLesson = {
  name:string,
  story:string,
  wordExplanations:WordExplanations,
  questions:ComprehensionQuestionAndAnswer[]
}

export default ComprehensionLesson;