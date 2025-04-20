import React, { useState, useEffect } from 'react';
import { movies } from '../data/movies';

const BannerHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredMovies = movies.filter(movie => movie.featured);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  const handleMouseMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Ekranın sol tarafına yakın mı kontrol et
    if (x < width * 0.3) {
      setCurrentSlide((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
    }
    // Ekranın sağ tarafına yakın mı kontrol et
    else if (x > width * 0.7) {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }
  };

  return (
    <div 
      className="relative h-[80vh] w-full overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {featuredMovies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <p className="text-lg mb-4">{movie.description}</p>
            <div className="flex gap-4">
              <button className="bg-white text-black px-6 py-2 rounded-md hover:bg-opacity-80 transition">
                Fragmanı İzle
              </button>
              <button className="bg-gray-600 bg-opacity-50 text-white px-6 py-2 rounded-md hover:bg-opacity-70 transition">
                Film Hakkında
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-gray-500'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerHome;
