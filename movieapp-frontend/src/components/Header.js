import React, { useEffect, useState, useMemo } from 'react'
import logo from '../assets/logo.png'
import { href, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import userIcon from '../assets/user.png'
import { IoSearch, IoSearchOutline } from "react-icons/io5";
import { navigation } from '../contants/navigation';
import { RiStarSmileFill } from "react-icons/ri";
import ProfileDropdown from './ProfileDropdown';
import tmdbService from '../services/tmdbService';
import MovieRow from './MovieRow';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [searchInput, setSearchInput] = useState('')
  const navigate = useNavigate()
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryMovies, setCategoryMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  const { t } = useTranslation();

  const CATEGORY_CONFIG = [
    { key: 'popular', label: t('Popüler'), fetch: () => tmdbService.getPopularMovies() },
    { key: 'trending', label: t('Trend'), fetch: () => tmdbService.getTrendingMovies() },
    { key: 'action', label: t('Aksiyon'), fetch: () => tmdbService.getMoviesByGenre(28) },
    { key: 'comedy', label: t('Komedi'), fetch: () => tmdbService.getMoviesByGenre(35) },
    { key: 'drama', label: t('Drama'), fetch: () => tmdbService.getMoviesByGenre(18) },
  ];

  // JWT decode helper (kopya, diğer admin sayfalarındakiyle aynı)
  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  // --- Login state management ---
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem('user'));
      // Admin kontrolü
      const token = localStorage.getItem('token');
      if (token) {
        const payload = parseJwt(token);
        setIsAdmin(payload && payload.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    };
    checkLogin();
    window.addEventListener('storage', checkLogin);
    window.addEventListener('userChanged', checkLogin);
    return () => {
      window.removeEventListener('storage', checkLogin);
      window.removeEventListener('userChanged', checkLogin);
    };
  }, []);

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
    if (searchInput) {
      navigate(`/search?q=${searchInput}`)
    }
  }, [searchInput])

  useEffect(() => {
    const match = location.pathname.match(/^\/category\/(\w+)/);
    if (match) {
      const cat = CATEGORY_CONFIG.find(c => c.key === match[1]);
      setSelectedCategory(cat || null);
    } else {
      setSelectedCategory(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    if (!selectedCategory) {
      setCategoryMovies([]);
      setLoadingMovies(false);
      return;
    }
    setLoadingMovies(true);
    setCategoryError(null);
    selectedCategory.fetch()
      .then(data => setCategoryMovies(data.results || []))
      .catch(() => setCategoryError(t('Filmler yüklenemedi.')))
      .finally(() => setLoadingMovies(false));
  }, [selectedCategory, t]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    navigate(`/category/${cat.key}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <>
      <header className='fixed top-0 w-full h-16 bg-gradient-to-r from-indigo-900 via-purple-800 to-black bg-opacity-90 shadow-lg shadow-purple-900/40 backdrop-blur-md z-50 transition-all duration-300'>
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

        <div className='container mx-auto px-3 flex items-center h-full'>
          <Link to={isAdmin ? "/admin" : "/"} className="transition-transform duration-300 hover:scale-105">
            <img
              src={logo}
              alt='logo'
              width={240}
            />
          </Link>
          {/* Kategori butonları sadece admin değilse göster */}
          {!isAdmin && (
            <div className='hidden lg:flex items-center gap-4 ml-5'>
              {CATEGORY_CONFIG.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400/60 border border-transparent backdrop-blur-md
                        ${selectedCategory && selectedCategory.key === cat.key
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                      : 'bg-white/10 text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 hover:text-white hover:shadow-lg'}
                      `}
                  style={{ letterSpacing: '0.03em' }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
          <div className='ml-auto flex items-center gap-5'>
            {/* Admin ise sadece çıkış butonu göster */}
            {isAdmin ? (
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  window.dispatchEvent(new Event('userChanged'));
                  window.location.href = '/login';
                }}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-red-700 hover:to-pink-700 transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-red-400/60"
              >
                {t('Çıkış Yap')}
              </button>
            ) : (
              <>
                <form className='flex items-center gap-2' onSubmit={handleSubmit}>
                  <input
                    type='text'
                    placeholder={t('Ara...')}
                    className='bg-transparent px-4 py-1 outline-none border-none hidden lg:block transition-all duration-300 focus:bg-white/10 rounded-md'
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}
                  />
                  <button className='text-2xl text-white transition-all duration-300 hover:scale-110'>
                    <IoSearchOutline />
                  </button>
                </form>
                {/* User profile and favorites */}
                <div className="flex items-center gap-3">
                  {isLoggedIn && (
                    <Link to="/favorites" className="text-white text-xl hover:text-purple-400 transition-all duration-300 hover:scale-110">
                      <RiStarSmileFill />
                    </Link>
                  )}
                  {isLoggedIn ? (
                    <ProfileDropdown />
                  ) : (
                    <Link
                      to="/login"
                      className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      {t('Giriş Yap')}
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
