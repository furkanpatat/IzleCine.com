import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaImage, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import tmdbService from '../services/tmdbService';
import userService from '../services/userService';
import './SearchPage.css';
import LoginPromptModal from '../components/LoginPromptModal';

const GENRE_MAP = {
  28: 'Aksiyon', 12: 'Macera', 16: 'Animasyon', 35: 'Komedi', 80: 'Suç', 99: 'Belgesel',
  18: 'Drama', 10751: 'Aile', 14: 'Fantastik', 36: 'Tarih', 27: 'Korku', 10402: 'Müzik',
  9648: 'Gizem', 10749: 'Romantik', 878: 'Bilim Kurgu', 10770: 'TV Filmi', 53: 'Gerilim',
  10752: 'Savaş', 37: 'Western'
};

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const SearchPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  // URL'den query parametresini al
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get('query') || '';

  const [searchInput, setSearchInput] = useState(initialQuery);
  const debouncedQuery = useDebounce(searchInput, 400);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageErrors, setImageErrors] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [likedMovies, setLikedMovies] = useState([]);

  useEffect(() => {
    // Eğer URL'deki query parametresi değişirse inputu güncelle
    setSearchInput(initialQuery);
    // eslint-disable-next-line
  }, [initialQuery]);

  // Liked movies'i yükle
  useEffect(() => {
    const loadLikedMovies = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        
        if (user && token) {
          const liked = await userService.getLikedMovies();
          setLikedMovies(liked);
        }
      } catch (error) {
        console.error('Error loading liked movies:', error);
      }
    };

    loadLikedMovies();
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    tmdbService.search(debouncedQuery)
      .then(data => {
        setResults(data.results || []);
        setError("");
      })
      .catch(() => setError(t('Arama sırasında hata oluştu.')))
      .finally(() => setLoading(false));
  }, [debouncedQuery, t]);

  const handleImageError = useCallback((movieId) => {
    setImageErrors(prev => ({ ...prev, [movieId]: true }));
  }, []);

  const handleMovieClick = useCallback((movieId) => {
    if (!movieId) return;
    window.location.href = `/movie/${movieId}`;
  }, []);

  const handleFavoriteClick = useCallback(async (e, movie) => {
    e.stopPropagation();
    
    // Kullanıcı giriş kontrolü
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
      setShowLoginModal(true);
      return;
    }

    try {
      const isLiked = likedMovies.some(liked => liked.movieId === movie.id);
      
      if (isLiked) {
        // Database'den kaldır
        await userService.removeLikedMovie(movie.id);
        setLikedMovies(prev => prev.filter(liked => liked.movieId !== movie.id));
      } else {
        // Database'e ekle
        await userService.addLikedMovie(movie.id);
        setLikedMovies(prev => [...prev, { movieId: movie.id, likedAt: new Date() }]);
      }
      
      // localStorage'ı da güncelle
      let favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
      if (isLiked) {
        favorites = favorites.filter(fav => fav.id !== movie.id);
      } else {
        favorites.push({
          id: movie.id,
          title: movie.title || movie.name || '',
          poster_path: movie.poster_path || movie.posterUrl || '',
          vote_average: movie.vote_average || 0,
          release_date: movie.release_date || '',
          genre_ids: movie.genre_ids || [],
        });
      }
      localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Favori işlemi sırasında bir hata oluştu!');
    }
  }, [likedMovies]);

  const handleContinueAsGuest = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  return (
    <>
      <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
        <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16">
          <h2 className="text-2xl font-bold mb-6">{t('Arama Sonuçları')}</h2>
          <div className="flex justify-center mb-8">
            <input
              type="text"
              value={searchInput}
              onChange={e => {
                setSearchInput(e.target.value);
                window.dispatchEvent(new CustomEvent('searchInputSync', { detail: e.target.value }));
              }}
              placeholder={t('Film, dizi veya kişi ara...')}
              className="w-full max-w-xl h-12 px-5 bg-white/20 text-white placeholder-white/70 font-medium rounded-full border border-purple-400/40 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:bg-white/30 transition-all duration-300 backdrop-blur-md hover:bg-white/30 hover:shadow-lg placeholder:italic placeholder:transition-colors placeholder:duration-300 text-base"
              autoFocus
            />
          </div>
          {loading ? (
            <p className="text-center text-lg py-8">{t('Loading')}...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-8">{error}</p>
          ) : (!results || results.length === 0) ? (
            <p className="text-center text-gray-400 py-8 text-xl">{t('No results found')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {results.map((movie) => {
                const isMovie = movie.media_type === 'movie' || movie.media_type === undefined;
                const isFavorite = likedMovies.some(liked => liked.movieId === movie.id);
                
                return (
                  <div
                    key={movie.id}
                    onClick={() => isMovie && handleMovieClick(movie.id)}
                    className={`group transform transition-all duration-300 hover:scale-105 hover:z-10 ${isMovie ? 'cursor-pointer' : 'cursor-default opacity-60'}`}
                  >
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl group">
                      {imageErrors[movie.id] ? (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <FaImage className="text-4xl text-gray-600" />
                        </div>
                      ) : (
                        <img
                          src={
                            movie.poster_path && movie.poster_path.startsWith('http')
                              ? movie.poster_path
                              : movie.posterUrl || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '')
                          }
                          alt={movie.title || 'Movie'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={() => handleImageError(movie.id)}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="absolute bottom-0 left-0 p-4 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-lg font-semibold mb-2 text-white line-clamp-2">{movie.title || movie.name || 'Unknown Title'}</h3>
                          <p className="text-sm text-gray-300 mb-2">
                            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                            {movie.genre_ids && movie.genre_ids.length > 0 &&
                              ' • ' + movie.genre_ids.map(id => GENRE_MAP[id] || '').filter(Boolean).join(', ')
                            }
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span className="ml-1 text-white font-medium">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                            </div>
                            {/* Favori butonu (database entegrasyonu ile) */}
                            <button
                              onClick={(e) => handleFavoriteClick(e, movie)}
                              className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                                isFavorite 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                              }`}
                              aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                              title={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                            >
                              {isFavorite ? <FaHeart size={22} /> : <FaRegHeart size={22} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onContinueAsGuest={handleContinueAsGuest}
        action="Film beğenmek"
      />
    </>
  );
};

export default SearchPage;
