import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaClock, FaFilm, FaImage, FaPlus, FaCheck } from 'react-icons/fa';
import CommentSection from './CommentSection';
import LoginPromptModal from './LoginPromptModal';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist } from '../store/watchlistSlice';
import { submitRating } from '../store/ratingSlice';
import tmdbService from '../services/tmdbService';
import UserService from '../services/userService';
import ratingService from '../services/ratingService';


const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [imageError, setImageError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginAction, setLoginAction] = useState('');
  const [izlecineRating, setIzlecineRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const dispatch = useDispatch();
  const watchlist = useSelector(state => state.watchlist?.items || []);
  const ratings = useSelector(state => state.ratings?.ratings || {});
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const currentUserId = storedUser?.id;
  const [isInWatchlist, setIsInWatchlist] = useState(false);

 
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) {
        setError('Film ID bulunamadı.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await tmdbService.getMovieDetails(id);

        if (!data || !data.id) {
          throw new Error('Film verisi alınamadı.');
        }

        setMovie(data);
      } catch (err) {
        console.error('Movie details fetch error:', err);
        setError(err.message || 'Film detayları yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // İzleCine ortalama puanını çek
  useEffect(() => {
    const fetchIzlecineRating = async () => {
      if (!movie?.id) return;
      try {
        const ratingData = await ratingService.getAverageRating(movie.id);
        setIzlecineRating(ratingData.avgRating || 0);
        setRatingCount(ratingData.count || 0);
      } catch (err) {
        console.error('İzleCine puanı çekilemedi:', err.message);
        setIzlecineRating(0);
        setRatingCount(0);
      }
    };

    fetchIzlecineRating();
  }, [movie?.id]);

  useEffect(() => {
    const fetchUserRating = async () => {
      if (!movie?.id || !currentUserId) return;
      try {
        const rating = await ratingService.getUserRating(movie.id, currentUserId);
        setUserRating(rating);
      } catch (err) {
        console.error('Kullanıcı puanı çekilemedi:', err.message);
      }
    };

    fetchUserRating();
  }, [movie, currentUserId]);

  useEffect(() => {
  const checkWatchlist = async () => {
    try {
      const savedItems = await UserService.getWatchlist(); // backend'ten çek
      const movieIds = savedItems.map(item => item.movieId); // sadece ID'leri al
      setIsInWatchlist(movieIds.includes(String(movie.id))); // kontrol et
    } catch (err) {
      console.error('Watchlist kontrol hatası:', err.message);
    }
  };

  if (movie?.id) {
    checkWatchlist();
  }
}, [movie?.id]);


  const handleImageError = () => {
    setImageError(true);
  };

  const handleAddToWatchlist = async () => {
    // Kullanıcı giriş kontrolü
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    if (!user || !token) {
      setLoginAction('İzleme listesine eklemek');
      setShowLoginModal(true);
      return;
    }
    try {
      await UserService.addToWatchlist(movie.id); // backend'e ekle
      setIsInWatchlist(true); // UI'da güncelle
      setIsAnimating(true); // animasyon başlasın
      setTimeout(() => setIsAnimating(false), 1500); // sonra bitsin
    } catch (err) {
      if (err.message.includes('zaten')) {
        alert('Bu film zaten izleme listesinde.');
      } else {
        alert('Film eklenirken bir hata oluştu.');
        console.error('Watchlist ekleme hatası:', err.message);
      }
    }
  };


  

  const handleRating = async (rating) => {
    // Check if user is authenticated
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
      setLoginAction('Film puanlamak');
      setShowLoginModal(true);
      return;
    }

    if (movie && currentUserId) {
      setUserRating(rating);
      const ratingData = {
        movieId: movie.id,
        userId: currentUserId,
        rating
      };
      
      try {
        await dispatch(submitRating(ratingData)).unwrap();
        
        // İzleCine ortalama puanını güncelle
        const updatedRatingData = await ratingService.getAverageRating(movie.id);
        setIzlecineRating(updatedRatingData.avgRating || 0);
        setRatingCount(updatedRatingData.count || 0);
      } catch (err) {
        console.error('Puan gönderme hatası:', err);
      }
    }
  };

  const handleContinueAsGuest = () => {
    setShowLoginModal(false);
    // User can continue browsing without authentication
  };

  const calculateAverageRating = () => {
    if (!movie) return 0;

    if (!ratings[movie.id]) return movie.vote_average || 0;

    const userRatings = Object.values(ratings[movie.id]);
    if (userRatings.length === 0) return movie.vote_average || 0;

    const sum = userRatings.reduce((acc, curr) => acc + curr, 0);
    return (sum / userRatings.length).toFixed(1);
  };

    if (loading) {
      return (
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center py-20">
          <div className="loading-spinner"></div>
        </div>
      );
    }

  if (error) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Film bulunamadı.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-300 hover:text-white mb-8 transition-all duration-300 hover:scale-105"
        >
          <FaArrowLeft className="mr-2 text-xl" />
          <span className="text-lg font-medium">Geri Dön</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
              {imageError ? (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <FaImage className="text-6xl text-gray-600" />
                </div>
              ) : (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <FaStar className="text-yellow-400" />
                <span className="text-lg font-semibold">{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaClock className="text-gray-400" />
                <span>{movie.runtime} dakika</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaFilm className="text-gray-400" />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
              {/* İzleCine Rating */}
              {izlecineRating > 0 && (
                <div className="flex items-center space-x-2 bg-purple-600/20 px-3 py-1 rounded-lg">
                  <FaStar className="text-purple-400" />
                  <span className="text-purple-400 font-semibold">{izlecineRating.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({ratingCount} oy)</span>
                </div>
              )}
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">{movie.overview}</p>

            {/* User Rating Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">Puanınızı Verin</h3>
              <div className="flex items-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`text-2xl transition-colors duration-200 ${
                      star <= (hoverRating || userRating)
                        ? 'text-yellow-400'
                        : 'text-gray-400 hover:text-yellow-400'
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-gray-300">
                  {hoverRating || userRating || 0}/10
                </span>
              </div>
              {userRating > 0 && (
                <p className="text-green-400 text-sm">Puanınız kaydedildi!</p>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-200">Türler</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map(genre => (
                    <span
                      key={genre.id}
                      className="bg-gray-700/50 px-4 py-2 rounded-lg text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <button
                onClick={handleAddToWatchlist}
                disabled={isInWatchlist}
                className={`
                  flex items-center justify-center gap-2
                  px-6 py-3 rounded-lg font-medium
                  transition-all duration-300
                  ${isInWatchlist
                    ? 'bg-green-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                  }
                  ${isAnimating ? 'animate-pulse' : ''}
                  shadow-lg hover:shadow-xl
                `}
              >
                {isInWatchlist ? (
                  <>
                    <FaCheck className="text-xl" />
                    <span>İzleme Listesinde</span>
                  </>
                ) : (
                  <>
                    <FaPlus className="text-xl" />
                    <span>İzleme Listesine Ekle</span>
                  </>
                )}
              </button>
              {isInWatchlist && (
                <div className="text-green-400 flex items-center gap-2 animate-fade-in">
                  <FaCheck className="text-xl" />
                  <span className="font-medium">Başarıyla eklendi!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <CommentSection movieId={id} />
      </div>

      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onContinueAsGuest={handleContinueAsGuest}
        action={loginAction}
      />
    </div>
  );
};
export default MovieDetails;
