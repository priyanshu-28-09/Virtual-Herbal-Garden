import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon } from '@heroicons/react/outline';

const LanguageSwitcher = ({ variant = 'default' }) => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const toggleLanguage = () => {
    const next = isHindi ? 'en' : 'hi';
    i18n.changeLanguage(next);
    localStorage.setItem('language', next);
    document.documentElement.lang = next;
  };

  const baseClass =
    variant === 'inverse'
      ? 'text-white'
      : 'text-gray-700 dark:text-gray-300';

  return (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 text-sm font-semibold hover:text-[#2ECC71] transition-colors ${baseClass}`}
      aria-label="Toggle language"
      title={isHindi ? 'Switch to English' : 'हिंदी में बदलें'}
    >
      <GlobeAltIcon className="w-5 h-5" />
      <span>{isHindi ? 'English' : 'हिंदी'}</span>
    </button>
  );
};

export default LanguageSwitcher;