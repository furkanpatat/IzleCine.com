import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaImage } from 'react-icons/fa';

const MovieRow = ({ title, movies }) => {
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState({});

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleImageError = (movieId) => {
    setImageErrors(prev => ({ ...prev, [movieId]: true }));
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {movies.map((movie) => (
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
                src={movie.image}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={() => handleImageError(movie.id)}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <h3 className="text-lg font-semibold mb-2 text-white">{movie.title}</h3>
                <p className="text-sm text-gray-300 mb-2">{movie.year} • {movie.category}</p>
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-white font-medium">{movie.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieRow; 