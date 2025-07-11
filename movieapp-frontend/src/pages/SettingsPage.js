import React, { useEffect, useState, useMemo } from 'react';
import apiService from '../services/apiService';
import i18n from '../i18n';

const SettingsPage = () => {
  const [form, setForm] = useState({ username: '', city: '', theme: 'light', language: 'tr' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Memoize star and meteor data to prevent re-rendering
  const starElements = useMemo(() => {
    return [...Array(100)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.3,
      className: `star star-${(i % 4) + 1}`
    }));
  }, []);

  const meteorElements = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 1}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${4 + Math.random() * 2}s`
    }));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    apiService.getUserProfile(token)
      .then(user => {
        setForm({
          username: user.username || '',
          city: user.city || '',
          theme: user.theme || 'light',
          language: user.language || (localStorage.getItem('lang') || 'tr'), 
        });
      })
      .catch(() => {});
  }, []);

  // Apply theme to body on mount and when theme changes
  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${form.theme}`);
  }, [form.theme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleThemeToggle = () => {
    setForm(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  const handleLanguageToggle = () => {
  const newLang = form.language === 'tr' ? 'en' : 'tr';
  setForm(prev => ({
    ...prev,
    language: newLang
  }));

  i18n.changeLanguage(newLang); // ✅ frontend dili anında değiştir
  localStorage.setItem('lang', newLang); // opsiyonel, refreshte de hatırlasın
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');
  const token = localStorage.getItem('token');
  try {
    await apiService.updateUserProfilePatch(token, form);

    // ✅ Dili i18n'e uygula ve localStorage'a yaz
    if (form.language) {
      i18n.changeLanguage(form.language);
      localStorage.setItem('lang', form.language);
    }

    setSuccess('Bilgileriniz güncellendi');
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-800 to-black bg-opacity-90 relative">
      {/* Animated Background - Full Height */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {meteorElements.map((meteor) => (
          <div
            key={meteor.id}
            className="meteor"
            style={{
              top: meteor.top,
              left: meteor.left,
              animationDelay: meteor.animationDelay,
              animationDuration: meteor.animationDuration,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {starElements.map((star) => (
          <div
            key={star.id}
            className={star.className}
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.animationDelay,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>
      {/* Settings Form */}
      <div className="relative z-10 flex justify-center items-start min-h-screen pt-24 px-4">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className={`text-3xl font-bold ${
              form.theme === 'dark' 
                ? 'text-white' 
                : 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
            }`}>
              Profil Ayarları
            </h2>
            <p className="text-gray-400 mt-2">Hesap bilgilerinizi güncelleyin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-400 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Kullanıcı Adı
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Kullanıcı adınızı girin"
                  required
                />
              </div>
            </div>

            {/* City Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Şehir (Opsiyonel)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Şehrinizi girin"
                />
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Tema
              </label>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-700/30 border border-gray-600/30">
                <div className="flex items-center space-x-3">
                  <span className="text-white font-medium">{form.theme === 'light' ? 'Açık Tema' : 'Koyu Tema'}</span>
                  <span className="text-gray-400 text-sm">{form.theme === 'light' ? 'Parlak görünüm' : 'Göz dostu görünüm'}</span>
                </div>
                <button
                  type="button"
                  onClick={handleThemeToggle}
                  className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${
                    form.theme === 'dark' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-lg transform transition-all duration-300 ${
                      form.theme === 'dark' ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
            {/* Language Toggle */}
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-300 flex items-center">
    🌐 Dil Seçimi
  </label>
  <button
    type="button"
    onClick={handleLanguageToggle}
    className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
  >
    {form.language === 'tr' ? 'Türkçe' : 'English'}
  </button>
</div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Değişiklikleri Kaydet</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 