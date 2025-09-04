import { useState, useEffect } from 'react';
import { i18n } from '../utils/i18n';

export const useTranslation = () => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  return {
    t: i18n.t.bind(i18n),
    currentLanguage: i18n.getCurrentLanguage(),
    setLanguage: i18n.setLanguage.bind(i18n),
    availableLanguages: i18n.getAvailableLanguages()
  };
};