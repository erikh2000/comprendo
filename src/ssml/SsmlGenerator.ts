export const PREVIOUS_LINE = -10001;
export const NEXT_LINE = -10002;
export const CURRENT_LINE = -10003;
export const PREVIOUS_SECTION = -10004;
// Next section would need extra data structures and a second pass at rendering. Not worth it. 
export const CURRENT_SECTION = -10006;
export const EXIT = -10007;
export const FIRST_LINE = -10008;

class SsmlGenerator {
  private _segments:string[];
  private readonly _homeLanguage:string;
  private readonly _homeLanguageSpeed:string;
  private readonly _targetLanguageSpeed:string;
  private _lineCount:number;
  private _sectionLineNos:number[];
  
  constructor(targetLanguageSpeed:string = 'x-slow', homeLanguage:string = 'en-US', homeLanguageSpeed:string = 'medium') {
    this._homeLanguage = homeLanguage;
    this._homeLanguageSpeed = homeLanguageSpeed;
    this._targetLanguageSpeed = targetLanguageSpeed;
    this._segments = [];
    this._sectionLineNos = [];
    this._lineCount = 0;
  }
  
  public get sectionCount():number {
    return this._sectionLineNos.length;
  }
  
  private _getLineNoFromLine(line:number):number {
    switch(line) {
      case PREVIOUS_LINE: return this.lastLineNo - 1;
      case NEXT_LINE: return this.lastLineNo + 1;
      case CURRENT_LINE: return this.lastLineNo;
      case PREVIOUS_SECTION:
        if (this.sectionCount < 2) return -1;
        return this._sectionLineNos[this._sectionLineNos.length-2];
      case CURRENT_SECTION:
        if (this.sectionCount < 1) return -1;
        return this._sectionLineNos[this._sectionLineNos.length-1];
      case EXIT: return -1;
      case FIRST_LINE: return 0;
      default: return this.lastLineNo + line;
    }
  }
  
  public addLine(speech:string):number {
    const lineNo = this._lineCount++;
    const line = `<mark name="line${lineNo}"/>${speech.trim()}`;
    this._segments.push(line);
    return lineNo;
  }
  
  public addSection(speech:string):number {
    const sectionSpeech = speech.endsWith(':') ? speech : `${speech}:`;
    const lineNo = this.addLine(sectionSpeech);
    this._sectionLineNos.push(lineNo);
    return lineNo;
  }
  
  public addHomeLanguageLine(speech:string):number {
    const lineNo = this._lineCount++;
    const line = `<mark name="line${lineNo}"/><prosody rate="${this._homeLanguageSpeed}"><lang xml:lang="${this._homeLanguage}">${speech.trim()}</lang></prosody>`;
    this._segments.push(line);
    return lineNo;
  }
  
  public addBreak(seconds:number = 1):void {
    this._segments.push(`<break time="${seconds}s"/>`);
  }
  
  public addPractice():void {
    this._segments.push(`<mark name="practice"/>`);
  }
  
  private _addInput( yesLine:number, noLine:number, silenceLine:number) {
    const yesLineNo = this._getLineNoFromLine(yesLine);
    const noLineNo = this._getLineNoFromLine(noLine);
    const silenceLineNo = this._getLineNoFromLine(silenceLine);
    this._segments.push(`<mark name="yes${yesLineNo}_no${noLineNo}_silence${silenceLineNo}"/>`);
  }
  
  public addYesNo(questionSpeech:string, yesLine:number, noLine:number):number {
    const questionLineNo = this.addLine(questionSpeech);
    this._addInput(yesLine, noLine, 0);
    return questionLineNo;
  }
  
  public toSsml():string {
    return `<speak><prosody rate="${this._targetLanguageSpeed}"><amazon:effect name="drc">${this._segments.join('')}</amazon:effect></prosody></speak>`;
  }
  
  public get lastLineNo():number { return this._lineCount-1; }
}

export default SsmlGenerator;