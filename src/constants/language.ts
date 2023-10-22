enum Language {
  ENGLISH = 'English',
  SPANISH = 'Spanish',
  GERMAN = 'German'
}

const languageToSpeechLanguageCode = {
  [Language.ENGLISH]: 'en-US',
  [Language.SPANISH]: 'es-MX',
  [Language.GERMAN]: 'de-DE'
};

export function getSpeechLanguageCode(language:Language):string {
  return languageToSpeechLanguageCode[language];
}

export function getLanguageCaseInsensitive(languageMixedCase:string):Language|null {
  const languageLowerCase = languageMixedCase.toLowerCase();
  for (const language of Object.values(Language)) {
    if (language.toLowerCase() === languageLowerCase) return language;
  }
  return null;
}

export default Language;