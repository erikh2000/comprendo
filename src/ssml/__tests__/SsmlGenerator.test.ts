import SsmlGenerator, { NEXT_LINE, CURRENT_LINE, PREVIOUS_LINE, PREVIOUS_SECTION, CURRENT_SECTION, EXIT } from "../SsmlGenerator";

describe('SsmlGenerator', () => {
  describe('constructor()', () => {
    it('creates an instance', () => {
      const ssmlGenerator = new SsmlGenerator();
      expect(ssmlGenerator).toBeInstanceOf(SsmlGenerator);
    });
    
    it('sets the default target language speed', () => {
      const ssmlGenerator = new SsmlGenerator();
      expect(ssmlGenerator.toSsml()).toEqual('<speak><prosody rate="x-slow"><amazon:effect name="drc"></amazon:effect></prosody></speak>');
    });
    
    it('sets the target language speed', () => {
      const ssmlGenerator = new SsmlGenerator('medium');
      expect(ssmlGenerator.toSsml()).toEqual('<speak><prosody rate="medium"><amazon:effect name="drc"></amazon:effect></prosody></speak>');
    });
    
    it('sets the default home language', () => {
      const ssmlGenerator = new SsmlGenerator();
      ssmlGenerator.addHomeLanguageLine('foo');
      expect(ssmlGenerator.toSsml()).toEqual('<speak><prosody rate="x-slow"><amazon:effect name="drc"><mark name="line0"/><prosody rate="medium"><lang xml:lang="en-US">foo</lang></prosody></amazon:effect></prosody></speak>');
    });
    
    it('sets the home language', () => {
      const ssmlGenerator = new SsmlGenerator('x-slow', 'en-GB');
      ssmlGenerator.addHomeLanguageLine('foo');
      expect(ssmlGenerator.toSsml()).toEqual('<speak><prosody rate="x-slow"><amazon:effect name="drc"><mark name="line0"/><prosody rate="medium"><lang xml:lang="en-GB">foo</lang></prosody></amazon:effect></prosody></speak>');
    });
    
    it('sets the default home language speed', () => {
      const ssmlGenerator = new SsmlGenerator();
      ssmlGenerator.addHomeLanguageLine('foo');
      expect(ssmlGenerator.toSsml()).toEqual('<speak><prosody rate="x-slow"><amazon:effect name="drc"><mark name="line0"/><prosody rate="medium"><lang xml:lang="en-US">foo</lang></prosody></amazon:effect></prosody></speak>');
    });
    
    it('sets the home language speed', () => {
      const ssmlGenerator = new SsmlGenerator('x-slow', 'en-US', 'fast');
      ssmlGenerator.addHomeLanguageLine('foo');
      expect(ssmlGenerator.toSsml()).toEqual('<speak><prosody rate="x-slow"><amazon:effect name="drc"><mark name="line0"/><prosody rate="fast"><lang xml:lang="en-US">foo</lang></prosody></amazon:effect></prosody></speak>');
    });
  });
  
  describe('addLine()', () => {
    it('adds a line', () => {
      const ssmlGenerator = new SsmlGenerator();
      ssmlGenerator.addLine('foo');
      expect(ssmlGenerator.toSsml()).toEqual('<speak><prosody rate="x-slow"><amazon:effect name="drc"><mark name="line0"/>foo</amazon:effect></prosody></speak>');
    });
    
    it('returns a 0-based line#', () => {
      const ssmlGenerator = new SsmlGenerator();
      expect(ssmlGenerator.addLine('foo')).toEqual(0);
    });
    
    it('returns incrementing line#s', () => {
      const ssmlGenerator = new SsmlGenerator();
      expect(ssmlGenerator.addLine('foo')).toEqual(0);
      expect(ssmlGenerator.addLine('bar')).toEqual(1);
      expect(ssmlGenerator.addLine('baz')).toEqual(2);
    });
    
    it('adds multiple lines', () => {
      const ssmlGenerator = new SsmlGenerator();
      ssmlGenerator.addLine('foo');
      ssmlGenerator.addLine('bar');
      expect(ssmlGenerator.toSsml()).toEqual('<speak><prosody rate="x-slow"><amazon:effect name="drc"><mark name="line0"/>foo<mark name="line1"/>bar</amazon:effect></prosody></speak>');
    });
  });
  
  describe('addHomeLanguageLine()', () => {
    it('adds a line', () => {
      const ssmlGenerator = new SsmlGenerator();
      ssmlGenerator.addHomeLanguageLine('foo');
      expect(ssmlGenerator.toSsml()).toEqual('<speak><prosody rate="x-slow"><amazon:effect name="drc"><mark name="line0"/><prosody rate="medium"><lang xml:lang="en-US">foo</lang></prosody></amazon:effect></prosody></speak>');
    });

    it('returns a 0-based line#', () => {
      const ssmlGenerator = new SsmlGenerator();
      expect(ssmlGenerator.addHomeLanguageLine('foo')).toEqual(0);
    });

    it('returns incrementing line#s', () => {
      const ssmlGenerator = new SsmlGenerator();
      expect(ssmlGenerator.addHomeLanguageLine('foo')).toEqual(0);
      expect(ssmlGenerator.addHomeLanguageLine('bar')).toEqual(1);
      expect(ssmlGenerator.addHomeLanguageLine('baz')).toEqual(2);
    });
    
    it('adds multiple lines', () => {
      const ssmlGenerator = new SsmlGenerator();
      ssmlGenerator.addHomeLanguageLine('foo');
      ssmlGenerator.addHomeLanguageLine('bar');
      expect(ssmlGenerator.toSsml()).toEqual('<speak><prosody rate="x-slow"><amazon:effect name="drc"><mark name="line0"/><prosody rate="medium"><lang xml:lang="en-US">foo</lang></prosody><mark name="line1"/><prosody rate="medium"><lang xml:lang="en-US">bar</lang></prosody></amazon:effect></prosody></speak>');
    });
  });
  
  describe('addBreak()', () => {
    it('adds a break', () => {
      const ssmlGenerator = new SsmlGenerator();
      ssmlGenerator.addBreak(1000);
      expect(ssmlGenerator.toSsml()).toEqual('<speak><prosody rate="x-slow"><amazon:effect name="drc"><break time="1000s"/></amazon:effect></prosody></speak>');
    });
  });
  
  describe('addPractice()', () => {
    it('adds a practice mark', () => {
      const ssmlGenerator = new SsmlGenerator();
      ssmlGenerator.addPractice();
      expect(ssmlGenerator.toSsml()).toEqual('<speak><prosody rate="x-slow"><amazon:effect name="drc"><mark name="practice"/></amazon:effect></prosody></speak>');
    });
  });
  
  describe('addSection()', () => {
    it('adds a section', () => {
      const ssmlGenerator = new SsmlGenerator();
      ssmlGenerator.addSection('foo');
      expect(ssmlGenerator.toSsml()).toEqual('<speak><prosody rate="x-slow"><amazon:effect name="drc"><mark name="line0"/>foo:</amazon:effect></prosody></speak>');
    });
    
    it('returns a 0-based line#', () => {
      const ssmlGenerator = new SsmlGenerator();
      expect(ssmlGenerator.addSection('foo')).toEqual(0);
    });
    
    it('returns incrementing line#s', () => {
      const ssmlGenerator = new SsmlGenerator();
      expect(ssmlGenerator.addSection('foo')).toEqual(0);
      expect(ssmlGenerator.addSection('bar')).toEqual(1);
      expect(ssmlGenerator.addSection('baz')).toEqual(2);
    });
  });
  
  describe('addYesNo()', () => {
    function _findInputMarkName(ssml:string):string {
      const foundPos = ssml.indexOf('name="yes');
      if (foundPos === -1) return '';
      const start = foundPos + 6;
      const end = ssml.indexOf('"', start);
      return ssml.substring(start, end);
    }
    
    it('adds a yes/no question', () => {
      const ssmlGenerator = new SsmlGenerator();
      ssmlGenerator.addYesNo('foo', 3, 4);
      expect(ssmlGenerator.toSsml()).toEqual('<speak><prosody rate=\"x-slow\"><amazon:effect name=\"drc\"><mark name=\"line0\"/>foo<mark name=\"yes3_no4_silence0\"/></amazon:effect></prosody></speak>');
    });

    it('evaluates NEXT_LINE', () => {
      const ssmlGenerator = new SsmlGenerator();
      ssmlGenerator.addYesNo('foo', NEXT_LINE, NEXT_LINE);
      const inputName = _findInputMarkName(ssmlGenerator.toSsml());
      expect(inputName).toEqual('yes1_no1_silence0');
    });

    it('evaluates PREVIOUS_LINE', () => {
      const ssmlGenerator = new SsmlGenerator();
      ssmlGenerator.addLine('bar');
      ssmlGenerator.addYesNo('foo', PREVIOUS_LINE, PREVIOUS_LINE);
      const inputName = _findInputMarkName(ssmlGenerator.toSsml());
      expect(inputName).toEqual('yes0_no0_silence1');
    });
    
    it('evaluates CURRENT_LINE', () => {
      const ssmlGenerator = new SsmlGenerator();
      ssmlGenerator.addYesNo('foo', CURRENT_LINE, CURRENT_LINE);
      const inputName = _findInputMarkName(ssmlGenerator.toSsml());
      expect(inputName).toEqual('yes0_no0_silence0');
    });
    
    it('evaluates CURRENT_SECTION', () => {
      const ssmlGenerator = new SsmlGenerator();
      ssmlGenerator.addLine('line0');
      ssmlGenerator.addSection('section1');
      ssmlGenerator.addLine('line2');
      ssmlGenerator.addYesNo('foo', CURRENT_SECTION, CURRENT_SECTION);
      const inputName = _findInputMarkName(ssmlGenerator.toSsml());
      expect(inputName).toEqual('yes1_no1_silence3');
    });

    it('evaluates PREVIOUS_SECTION', () => {
      const ssmlGenerator = new SsmlGenerator();
      ssmlGenerator.addLine('line0');
      ssmlGenerator.addSection('section1');
      ssmlGenerator.addLine('line2');
      ssmlGenerator.addSection('section3');
      ssmlGenerator.addYesNo('foo', PREVIOUS_SECTION, PREVIOUS_SECTION);
      const inputName = _findInputMarkName(ssmlGenerator.toSsml());
      expect(inputName).toEqual('yes1_no1_silence4');
    });
    
    it('evaluates relative line#s', () => {
      const ssmlGenerator = new SsmlGenerator();
      ssmlGenerator.addLine('line0');
      ssmlGenerator.addLine('line1');
      ssmlGenerator.addLine('line2');
      ssmlGenerator.addYesNo('foo', 1, -2);
      const inputName = _findInputMarkName(ssmlGenerator.toSsml());
      expect(inputName).toEqual('yes4_no1_silence3');
    });
  });
});