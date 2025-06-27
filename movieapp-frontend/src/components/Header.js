import React, { useEffect , useState} from 'react'
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

const CATEGORY_CONFIG = [
  { key: 'popular', label: 'Popüler', fetch: () => tmdbService.getPopularMovies() },
  { key: 'trending', label: 'Trend', fetch: () => tmdbService.getTrendingMovies() },
  { key: 'action', label: 'Aksiyon', fetch: () => tmdbService.getMoviesByGenre(28) },
  { key: 'comedy', label: 'Komedi', fetch: () => tmdbService.getMoviesByGenre(35) },
  { key: 'drama', label: 'Drama', fetch: () => tmdbService.getMoviesByGenre(18) },
];

const Header = () => {

  const [searchInput, setSearchInput] = useState ('')
  const navigate = useNavigate()
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_CONFIG[0]);
  const [categoryMovies, setCategoryMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  const { t } = useTranslation();
  
  
  useEffect (()=>{
    if(searchInput){
      navigate(`/search?q=${searchInput}`)
    }
   
  },[searchInput])

  useEffect(() => {
    if (location.pathname === '/') {
      setSelectedCategory(CATEGORY_CONFIG[0]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    setLoadingMovies(true);
    setCategoryError(null);
    selectedCategory.fetch()
      .then(data => setCategoryMovies(data.results || []))
      .catch(() => setCategoryError('Filmler yüklenemedi.'))
      .finally(() => setLoadingMovies(false));
  }, [selectedCategory]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    navigate(`/category/${cat.key}`);
  };

  const handleSubmit = (e)=>{
    e.preventDefault()
  }

  return (
    <>
    <header  className='fixed top-0 w-full h-16 bg-gradient-to-r from-indigo-900 via-purple-800 to-black bg-opacity-90 shadow-lg shadow-purple-900/40 backdrop-blur-md z-50'>
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
  {[...Array(20)].map((_, i) => (
    <div
      key={i}
      className="meteor"
      style={{
        top: `${Math.random() * 1}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${4 + Math.random() * 2}s`,
      }}
    />
  ))}
</div>
<div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
  {[...Array(100)].map((_, i) => (
    <div
      key={i}
      className={`star star-${(i % 4) + 1}`}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`, // Yıldızlar farklı zamanlarda hareket etmeye başlayacak
        opacity: Math.random() * 0.5 + 0.3, // Yıldızların parlaklıkları rastgele olacak
      }}
    />
  ))}
</div>

            <div className='container mx-auto px-3 flex items-center h-full'>

                <Link to = {"/"} >
                    <img
                            src={logo}
                            alt='logo'
                            width={240}

                    />
                </Link>
              <div className='hidden lg:flex items-center gap-4 ml-5'>
                {CATEGORY_CONFIG.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400/60 border border-transparent backdrop-blur-md
                      ${selectedCategory.key === cat.key
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                        : 'bg-white/10 text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 hover:text-white hover:shadow-lg'}
                    `}
                    style={{letterSpacing: '0.03em'}}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className='ml-auto flex items-center gap-5'>
                <form className='flex items-center gap-2' onSubmit={handleSubmit}>
                  <input
                  type='text'
                  placeholder='Search...'
                  className='bg-transparent px-4 py-1 outline-none border-none hidden lg:block'
                  onChange={(e)=>setSearchInput(e.target.value)}
                  value = {searchInput}
                  />
                  <button className='text-2xl text-white'>
                    <IoSearchOutline/>
                  </button>
                </form>
                <ProfileDropdown />
                {/* 💖 Favoriler İkonu */}
                <Link to="/favorites" className="text-white text-xl hover:text-purple-700 transition-all ">
                <RiStarSmileFill /> 
                        </Link>
                  {/* Giriş Yap Butonu */}
                <Link to="/login" className="bg-purple-700 hover:bg-purple-300 text-white px-4 py-2 rounded-md transition-all duration-300">
                  {t('Giriş Yap')}
                </Link>      
              </div>
            </div>

    </header>
    </>
  )
}

export default Header
