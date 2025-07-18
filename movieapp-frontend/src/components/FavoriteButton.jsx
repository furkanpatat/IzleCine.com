import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

// movie: { id, title, poster_path, ... }
const FavoriteButton = ({ movie, className = '', iconSize = 22, onToggle }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    setIsFavorite(favorites.some(fav => fav.id === movie.id));
  }, [movie.id]);

  const handleToggle = (e) => {
    e.stopPropagation();
    let favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    const exists = favorites.some(fav => fav.id === movie.id);
    if (exists) {
      favorites = favorites.filter(fav => fav.id !== movie.id);
      setIsFavorite(false);
    } else {
      // Favoriye eklerken temel bilgileri kaydet
      favorites.push({
        id: movie.id,
        title: movie.title || movie.name || '',
        poster_path: movie.poster_path || movie.posterUrl || '',
        vote_average: movie.vote_average || 0,
        release_date: movie.release_date || '',
        genre_ids: movie.genre_ids || [],
      });
      setIsFavorite(true);
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
    if (onToggle) onToggle(favorites);
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${isFavorite ? 'bg-red-500 text-white' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'} ${className}`}
      aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      title={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
    >
      {isFavorite ? <FaHeart size={iconSize} /> : <FaRegHeart size={iconSize} />}
    </button>
  );
};

export default FavoriteButton; 