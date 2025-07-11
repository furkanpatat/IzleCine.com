import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaImage, FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { removeFromWatchlist } from '../store/watchlistSlice';
import UserService from '../services/userService';
import tmdbService from '../services/tmdbService';
import { useTranslation } from 'react-i18next';

const Watchlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imageErrors, setImageErrors] = useState({});
  const [watchlist, setWatchlist] = useState([]);
  const { t } = useTranslation();

useEffect(() => {
  const fetchWatchlist = async () => {
    try {
      const savedItems = await UserService.getWatchlist(); // [{ movieId, addedAt }]
      const movieIds = savedItems.map(item => item.movieId);

      const detailedMovies = await Promise.all(
        movieIds.map(async (id) => {
          const res = await tmdbService.getMovieDetails(id);
          return res;
        })
      );

      setWatchlist(detailedMovies);
    } catch (err) {
      console.error(t('İzleme listesi alınamadı:'), err.message);
    }
  };

  fetchWatchlist();
}, [t]);
  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleImageError = (movieId) => {
    setImageErrors(prev => ({
      ...prev,
      [movieId]: true
    }));
  };

  const handleRemoveFromWatchlist = async (e, movieId) => {
  e.stopPropagation();

  try {
    await UserService.removeFromWatchlist(movieId); // Backend'den sil
    setWatchlist(prev => prev.filter(movie => movie.id !== movieId)); // Ekrandan da kaldır
  } catch (err) {
    console.error(t("Silme başarısız:"), err.message);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-300 hover:text-white mb-8 transition-all duration-300 hover:scale-105"
        >
          <FaArrowLeft className="mr-2 text-xl" />
          <span className="text-lg font-medium">{t('Geri Dön')}</span>
        </button>

        <h1 className="text-4xl font-bold mb-8">
          {t('İzleme Listem')}
        </h1>

        {watchlist.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">
              {t('İzleme listenizde henüz film bulunmuyor.')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {watchlist.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie.id)}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group relative"
              >
                <div className="relative aspect-[2/3]">
                  {imageErrors[movie.id] ? (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <FaImage className="text-4xl text-gray-500" />
                    </div>
                  ) : (
                    <img
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/default-image.png'}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(movie.id)}
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">{movie.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span>{movie.year}</span>
                    <span>{movie.category}</span>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>{movie.rating}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleRemoveFromWatchlist(e, movie.id)}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  title={t('İzleme Listesinden Kaldır')}
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist; 