import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaImage } from 'react-icons/fa';
import userService from '../services/userService';
import tmdbService from '../services/tmdbService';

const GENRE_MAP = {
  28: 'Aksiyon', 12: 'Macera', 16: 'Animasyon', 35: 'Komedi', 80: 'Suç', 99: 'Belgesel',
  18: 'Drama', 10751: 'Aile', 14: 'Fantastik', 36: 'Tarih', 27: 'Korku', 10402: 'Müzik',
  9648: 'Gizem', 10749: 'Romantik', 878: 'Bilim Kurgu', 10770: 'TV Filmi', 53: 'Gerilim',
  10752: 'Savaş', 37: 'Western'
};

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        
        if (user && token) {
          // Database'den liked movies'i yükle
          const likedMovies = await userService.getLikedMovies();
          
          // TMDB'den film detaylarını al
          const movieDetails = await Promise.all(
            likedMovies.map(async (liked) => {
              try {
                const movieData = await tmdbService.getMovieDetails(liked.movieId);
                return {
                  id: liked.movieId,
                  title: movieData.title,
                  poster_path: movieData.poster_path,
                  release_date: movieData.release_date,
                  vote_average: movieData.vote_average,
                  genre_ids: movieData.genres?.map(g => g.id) || [],
                  likedAt: liked.likedAt
                };
              } catch (error) {
                console.error(`Error fetching movie ${liked.movieId}:`, error);
                return null;
              }
            })
          );
          
          // Null değerleri filtrele
          const validMovies = movieDetails.filter(movie => movie !== null);
          setFavorites(validMovies);
        } else {
          // Giriş yapmamış kullanıcılar için localStorage
          const localFavorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
          setFavorites(localFavorites);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        setError('Favoriler yüklenirken hata oluştu');
        // Hata durumunda localStorage'dan yükle
        const localFavorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
        setFavorites(localFavorites);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (e, movieId) => {
    e.stopPropagation();
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      
      if (user && token) {
        // Database'den kaldır
        await userService.removeLikedMovie(movieId);
      }
      
      // State'den kaldır
      const updated = favorites.filter(fav => fav.id !== movieId);
      setFavorites(updated);
      
      // localStorage'ı da güncelle
      localStorage.setItem('favoriteMovies', JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Favori kaldırılırken hata oluştu!');
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleImageError = (movieId) => {
    setImageErrors(prev => ({ ...prev, [movieId]: true }));
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-white flex items-center justify-center py-20">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Favoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-white flex items-center justify-center py-20">
        <div className="text-center">
          <FaHeart className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Hata</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-gray-900 text-white flex items-center justify-center py-20">
        <div className="text-center">
          <FaHeart className="text-6xl text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Henüz Favori Filminiz Yok</h2>
          <p className="text-gray-400">Beğendiğiniz filmleri favorilere ekleyerek burada görüntüleyebilirsiniz.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white py-8 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Favori Filmlerim ({favorites.length})</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favorites.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie.id)}
              className="group relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              {imageErrors[movie.id] ? (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <FaImage className="text-4xl text-gray-600" />
                </div>
              ) : (
                <img
                  src={movie.poster_path && !movie.poster_path.startsWith('http') ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : movie.poster_path}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(movie.id)}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h3 className="text-lg font-semibold mb-2 text-white">{movie.title}</h3>
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
                    <button
                      onClick={e => handleRemoveFavorite(e, movie.id)}
                      className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                    >
                      <FaHeart />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage; 