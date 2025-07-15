import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import apiService from '../services/apiService';
import { useTranslation } from 'react-i18next';

// JWT decode helper
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const errorRef = useRef(null);
  const { t } = useTranslation();
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState(null);

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
    const fetchAdmins = async () => {
      setAdminLoading(true);
      setAdminError(null);
      try {
        // Admin endpointi için bir token gerekebilir, gerekirse buraya bir sabit admin tokenı eklenebilir
        const token = localStorage.getItem('token');
        const admins = await apiService.getAdminUsers(token);
        setAdminUsers(admins);
      } catch (err) {
        setAdminError('Admin bilgileri alınamadı');
      } finally {
        setAdminLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  // Clear error on input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('userChanged'));
      // JWT'den rolü kontrol et
      const payload = parseJwt(data.token);
      if (payload && payload.role === 'admin') {
        navigate('/admin');
        return;
      }
      // Check if user has completed their profile
      const isProfileComplete = await apiService.checkProfileComplete(data.token);
      if (isProfileComplete) {
        navigate('/user-profile');
      } else {
        navigate('/complete-profile');
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => {
        if (errorRef.current) errorRef.current.focus();
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-black bg-opacity-90 relative">
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

        {/* Login Form */}
        <div className="relative z-10 flex justify-center items-start pt-24 px-4 pb-8">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 w-full max-w-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Giriş Yap</h2>
              <p className="text-gray-400">Hesabınıza giriş yapın</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div
                  ref={errorRef}
                  tabIndex={-1}
                  className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm animate-shake"
                  aria-live="assertive"
                >
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  {t('E-posta Adresiniz')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder={t('ornek@email.com')}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  {t('Şifre')}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder={t('••••••••')}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 hover:scale-105 hover:shadow-lg ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? t('Giriş Yapılıyor...') : t('Giriş Yap')}
              </button>

              <div className="text-center">
                <Link
                  to="/signup"
                  className="inline-block w-full bg-gray-700/50 text-gray-300 py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-600/50 hover:text-white hover:scale-105"
                >
                  {t('Kayıt Ol')}
                </Link>
              </div>

              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-300 hover:underline"
                >
                  {t('Şifrenizi mi unuttunuz?')}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
