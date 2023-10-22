import { getSharedSpeech } from "../sharedSpeech";
import Language from "../../constants/language";

describe('sharedSpeech', () => {
  describe('getSharedSpeech()', () => {
    it('returns the shared speech for the given language', () => {
      expect(getSharedSpeech(Language.SPANISH)).not.toBeNull();
    });
  });
});