import React, { useState, useEffect } from 'react';
import BannerHome from '../components/BannerHome';
import MovieRow from '../components/MovieRow';
import { movies } from '../data/movies';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [newMovies, setNewMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  useEffect(() => {
    setTrendingMovies(movies.filter(movie => movie.trending));
    setNewMovies(movies.filter(movie => movie.new));
    setRecommendedMovies(movies.filter(movie => movie.recommended));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <BannerHome />
      
      <div className="container mx-auto px-4 py-8">
        <MovieRow title="Trend Filmler" movies={trendingMovies} />
        <MovieRow title="Yeni Gelenler" movies={newMovies} />
        <MovieRow title="İlginizi Çekebilir" movies={recommendedMovies} />
      </div>
    </div>
  );
};

export default Home;
