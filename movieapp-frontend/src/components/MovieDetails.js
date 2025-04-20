import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaClock, FaFilm, FaImage, FaPlus, FaCheck } from 'react-icons/fa';
import CommentSection from './CommentSection';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist } from '../store/watchlistSlice';
import { addRating, updateRating } from '../store/ratingSlice';
import { movies } from '../data/movies';

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [imageError, setImageError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const dispatch = useDispatch();
  const watchlist = useSelector(state => state.watchlist.items);
  const ratings = useSelector(state => state.ratings.ratings);
  const isInWatchlist = watchlist.some(movie => movie.id === parseInt(id));

  // ID'ye göre filmi bul
  const movie = movies.find(m => m.id === parseInt(id));

  // Eğer film bulunamazsa ana sayfaya yönlendir
  useEffect(() => {
    if (!movie) {
      navigate('/');
    }
  }, [movie, navigate]);

  // Kullanıcının mevcut puanını yükle
  useEffect(() => {
    if (movie && ratings[movie.id]) {
      // Gerçek uygulamada burada kullanıcı ID'si kullanılacak
      const currentUserRating = ratings[movie.id]['currentUser'];
      if (currentUserRating) {
        setUserRating(currentUserRating);
      }
    }
  }, [movie, ratings]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleAddToWatchlist = () => {
    if (!isInWatchlist && movie) {
      setIsAnimating(true);
      dispatch(addToWatchlist(movie));
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  };

  const handleRating = (rating) => {
    if (movie) {
      setUserRating(rating);
      // Gerçek uygulamada burada kullanıcı ID'si kullanılacak
      const ratingData = {
        movieId: movie.id,
        userId: 'currentUser',
        rating: rating
      };
      
      if (ratings[movie.id] && ratings[movie.id]['currentUser']) {
        dispatch(updateRating(ratingData));
      } else {
        dispatch(addRating(ratingData));
      }
    }
  };

  const calculateAverageRating = () => {
    if (!movie || !ratings[movie.id]) return movie.rating;
    
    const userRatings = Object.values(ratings[movie.id]);
    if (userRatings.length === 0) return movie.rating;
    
    const sum = userRatings.reduce((acc, curr) => acc + curr, 0);
    return (sum / userRatings.length).toFixed(1);
  };

  if (!movie) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-300 hover:text-white mb-8 transition-all duration-300 hover:scale-105"
        >
          <FaArrowLeft className="mr-2 text-xl" />
          <span className="text-lg font-medium">Geri Dön</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
              {imageError ? (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <FaImage className="text-6xl text-gray-600" />
                </div>
              ) : (
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              )}
            </div>
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{movie.title}</h1>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center bg-gray-700/50 px-4 py-2 rounded-lg">
                  <FaStar className="text-yellow-400 mr-2" />
                  <span className="font-medium">{calculateAverageRating()}</span>
                </div>
                <div className="flex items-center bg-gray-700/50 px-4 py-2 rounded-lg">
                  <FaClock className="text-gray-400 mr-2" />
                  <span className="font-medium">{movie.year}</span>
                </div>
                <div className="flex items-center bg-gray-700/50 px-4 py-2 rounded-lg">
                  <FaFilm className="text-gray-400 mr-2" />
                  <span className="font-medium">{movie.category}</span>
                </div>
              </div>

              {/* User Rating Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-200">Filmi Puanla</h2>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none"
                    >
                      <FaStar
                        className={`w-8 h-8 transition-colors duration-200 ${
                          (hoverRating || userRating) >= star
                            ? 'text-yellow-400'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-gray-300">
                    {userRating > 0 ? `Puanınız: ${userRating}` : 'Puan verin'}
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-200">Açıklama</h2>
                <p className="text-gray-300 leading-relaxed">{movie.description}</p>
              </div>

              {/* Add to Watchlist Button */}
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
        </div>

        {/* Comment Section */}
        <CommentSection />
      </div>
    </div>
  );
};

export default MovieDetails; 