import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('tr');
  const dropdownRef = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    // Tema değişikliği için gerekli işlemler burada yapılacak
  };

  const toggleLanguage = () => {
    const newLang = language === 'tr' ? 'en' : 'tr';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-8 h-8 rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500/50 transition-all duration-300"
        onMouseEnter={() => setIsOpen(true)}
      >
        <img
          src={require('../assets/user.png')}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {isOpen && (
        <div
          className="absolute right-0 md:right-auto md:left-0 mt-2 w-48 bg-gray-800/80 backdrop-blur-md rounded-lg shadow-xl py-3 z-50 border border-gray-700/50 transition-all duration-300 transform origin-top"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          style={{
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <Link
            to="/profil"
            className="block px-4 py-3 text-xs font-medium text-gray-200 hover:bg-gray-700/50 hover:text-white transition-colors duration-200"
          >
            {t('Profil')}
          </Link>

          <Link
            to="/watchlist"
            className="block px-4 py-3 text-xs font-medium text-gray-200 hover:bg-gray-700/50 hover:text-white transition-colors duration-200"
          >
            {t('İzleme Listesi')}
          </Link>

           <Link
              to="/user-profile"
              className="block px-4 py-3 text-xs font-medium text-gray-200 hover:bg-gray-700/50 hover:text-white transition-colors duration-200"
            >
               {t('Ayarlar')}
            </Link>
          
          <div className="px-4 py-3 text-xs font-medium text-gray-200">
            <div className="flex items-center justify-between">
              <span>{t('Tema')}</span>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-purple-600/80' : 'bg-gray-400/80'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                    theme === 'dark' ? 'translate-x-4' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="px-4 py-3 text-xs font-medium text-gray-200">
            <div className="flex items-center justify-between">
              <span>{t('Dil')}</span>
              <button
                onClick={toggleLanguage}
                className={`px-2 py-1 rounded-md transition-colors duration-300 ${
                  language === 'tr' ? 'bg-purple-600/80' : 'bg-gray-600/80'
                }`}
              >
                {language.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 