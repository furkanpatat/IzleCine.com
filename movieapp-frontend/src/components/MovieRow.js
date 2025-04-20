import React from 'react';

const MovieRow = ({ title, movies }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="group relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
                <p className="text-sm text-gray-300">{movie.year} • {movie.category}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{movie.rating}</span>
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