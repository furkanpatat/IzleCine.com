import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import LoginPromptModal from './LoginPromptModal';
import userService from '../services/userService';

// movie: { id, title, poster_path, ... }
const FavoriteButton = ({ movie, className = '', iconSize = 22, onToggle }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Database'den liked movies'i kontrol et
    const checkLikedMovies = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        
        if (user && token) {
          const likedMovies = await userService.getLikedMovies();
          const isLiked = likedMovies.some(liked => liked.movieId === movie.id);
          setIsFavorite(isLiked);
        } else {
          // Giriş yapmamış kullanıcılar için localStorage kontrolü
          const favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
          setIsFavorite(favorites.some(fav => fav.id === movie.id));
        }
      } catch (error) {
        console.error('Error checking liked movies:', error);
        // Hata durumunda localStorage kontrolü
        const favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
        setIsFavorite(favorites.some(fav => fav.id === movie.id));
      }
    };

    checkLikedMovies();
  }, [movie.id]);

  const handleToggle = async (e) => {
    e.stopPropagation();
    
    if (isLoading) return;
    setIsLoading(true);
    
    // Kullanıcı giriş kontrolü
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
      setShowLoginModal(true);
      setIsLoading(false);
      return;
    }

    try {
      if (isFavorite) {
        // Database'den kaldır
        await userService.removeLikedMovie(movie.id);
        setIsFavorite(false);
      } else {
        // Database'e ekle
        await userService.addLikedMovie(movie.id);
        setIsFavorite(true);
      }
      
      // localStorage'ı da güncelle
      let favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
      if (isFavorite) {
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
      
      if (onToggle) onToggle(favorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Favori işlemi sırasında bir hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    setShowLoginModal(false);
    // Kullanıcı misafir olarak devam edebilir
  };

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
          isFavorite ? 'bg-red-500 text-white' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
        title={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      >
        {isFavorite ? <FaHeart size={iconSize} /> : <FaRegHeart size={iconSize} />}
      </button>

      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onContinueAsGuest={handleContinueAsGuest}
        action="Film beğenmek"
      />
    </>
  );
};

export default FavoriteButton; 