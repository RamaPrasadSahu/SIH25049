import React, { createContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../utils/languages';
import { getTranslation } from '../utils/translations';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('user_preferred_language') || DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    localStorage.setItem('user_preferred_language', selectedLanguage);
  }, [selectedLanguage]);

  const currentLanguageObj = SUPPORTED_LANGUAGES[selectedLanguage] || SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE];

  // Helper translation function t(key)
  const t = (key) => getTranslation(selectedLanguage, key);

  return (
    <LanguageContext.Provider value={{
      selectedLanguage,
      setSelectedLanguage,
      currentLanguageObj,
      supportedLanguages: SUPPORTED_LANGUAGES,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
