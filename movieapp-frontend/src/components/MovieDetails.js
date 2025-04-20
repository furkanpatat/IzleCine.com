import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaClock, FaFilm, FaImage, FaPlus, FaCheck } from 'react-icons/fa';
import CommentSection from './CommentSection';

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // This is a placeholder. In a real app, you would fetch the movie details from an API
  const movie = {
    id: id,
    title: "Sample Movie",
    year: "2023",
    duration: "2h 15m",
    rating: "8.5",
    description: "This is a sample movie description. In a real application, this would be fetched from your backend API.",
    cast: ["Actor 1", "Actor 2", "Actor 3"],
    category: "Action",
    image: "https://via.placeholder.com/500x750"
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleAddToWatchlist = () => {
    if (!isAdded) {
      setIsAnimating(true);
      // Simulate API call
      setTimeout(() => {
        setIsAdded(true);
        setIsAnimating(false);
      }, 500);
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
          <span className="text-lg font-medium">Back to Home</span>
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
                  <span className="font-medium">{movie.rating}</span>
                </div>
                <div className="flex items-center bg-gray-700/50 px-4 py-2 rounded-lg">
                  <FaClock className="text-gray-400 mr-2" />
                  <span className="font-medium">{movie.duration}</span>
                </div>
                <div className="flex items-center bg-gray-700/50 px-4 py-2 rounded-lg">
                  <FaFilm className="text-gray-400 mr-2" />
                  <span className="font-medium">{movie.category}</span>
                </div>
                <div className="flex items-center bg-gray-700/50 px-4 py-2 rounded-lg">
                  <span className="font-medium">{movie.year}</span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-200">Description</h2>
                <p className="text-gray-300 leading-relaxed">{movie.description}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-200">Cast</h2>
                <div className="flex flex-wrap gap-3">
                  {movie.cast.map((actor, index) => (
                    <span
                      key={index}
                      className="bg-gray-700/50 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-600/50 transition-colors duration-300"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Add to Watchlist Button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleAddToWatchlist}
                  disabled={isAdded}
                  className={`
                    flex items-center justify-center gap-2
                    px-6 py-3 rounded-lg font-medium
                    transition-all duration-300
                    ${isAdded
                      ? 'bg-green-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                    }
                    ${isAnimating ? 'animate-pulse' : ''}
                    shadow-lg hover:shadow-xl
                  `}
                >
                  {isAdded ? (
                    <>
                      <FaCheck className="text-xl" />
                      <span>Added to Watchlist</span>
                    </>
                  ) : (
                    <>
                      <FaPlus className="text-xl" />
                      <span>Add to Watchlist</span>
                    </>
                  )}
                </button>
                {isAdded && (
                  <div className="text-green-400 flex items-center gap-2 animate-fade-in">
                    <FaCheck className="text-xl" />
                    <span className="font-medium">Successfully added!</span>
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