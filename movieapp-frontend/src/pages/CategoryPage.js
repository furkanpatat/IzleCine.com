import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import tmdbService from '../services/tmdbService';
import MovieRow from '../components/MovieRow';
import { useTranslation } from 'react-i18next';

const CategoryPage = () => {
  const { key } = useParams();
  const { t } = useTranslation();
  
  const CATEGORY_CONFIG = useMemo(() => [
    { key: 'popular', label: t('Popüler'), fetch: () => tmdbService.getPopularMovies() },
    { key: 'trending', label: t('Trend'), fetch: () => tmdbService.getTrendingMovies() },
    { key: 'action', label: t('Aksiyon'), fetch: () => tmdbService.getMoviesByGenre(28) },
    { key: 'comedy', label: t('Komedi'), fetch: () => tmdbService.getMoviesByGenre(35) },
    { key: 'drama', label: t('Drama'), fetch: () => tmdbService.getMoviesByGenre(18) },
  ], [t]);
  
  const category = useMemo(() => 
    CATEGORY_CONFIG.find(cat => cat.key === key), 
    [CATEGORY_CONFIG, key]
  );
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) {
      setError(t('Geçersiz kategori!'));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    category.fetch()
      .then(data => setMovies(data.results || []))
      .catch(() => setError(t('Filmler yüklenemedi.')))
      .finally(() => setLoading(false));
  }, [category?.key, t]); // category.key değiştiğinde çalışsın

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white pt-24 px-4">
      {loading ? (
        <div className="text-white py-8">{t('Filmler yükleniyor...')}</div>
      ) : error ? (
        <div className="text-red-400 py-8">{error}</div>
      ) : category ? (
        <MovieRow title={category.label + ' ' + t('Filmleri')} movies={movies} />
      ) : null}
    </div>
  );
};

export default CategoryPage; 