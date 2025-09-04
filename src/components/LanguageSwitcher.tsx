import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setLanguage, availableLanguages } = useTranslation();

  return (
    <div className="relative">
      <select
        value={currentLanguage}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'zh')}
        className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {availableLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );
};

export default LanguageSwitcher;