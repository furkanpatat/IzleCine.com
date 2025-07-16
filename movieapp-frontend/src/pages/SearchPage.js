import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import apiService from '../services/apiService';
 // ✅ Doğru path
import './SearchPage.css'; // ❗ CSS'ine dokunmadım

const SearchPage = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    genre: '',
    director: '',
    cast: '',
    sortBy: 'title',
    sortOrder: 'asc'
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.searchMovies(query, filters);
      setResults(data);
    } catch (error) {
      console.error('Arama hatası:', error);
    }
    setLoading(false);
  }, [query, filters]);

  useEffect(() => {
    handleSearch(); // Sayfa yüklenince ilk arama
  }, [handleSearch]);

  const handleInputChange = (e) => setQuery(e.target.value);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="search-page">
      <h2>{t('SearchPage')}</h2>

      <div className="search-form">
        <input
          type="text"
          placeholder="Film adı, yönetmen, oyuncu..."
          value={query}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="genre"
          placeholder="Tür (örnek: Aksiyon)"
          value={filters.genre}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="director"
          placeholder="Yönetmen"
          value={filters.director}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="cast"
          placeholder="Oyuncu"
          value={filters.cast}
          onChange={handleFilterChange}
        />

        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value="title">Başlık</option>
          <option value="year">Yıl</option>
          <option value="rating">Puan</option>
        </select>

        <select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange}>
          <option value="asc">Artan</option>
          <option value="desc">Azalan</option>
        </select>

        <button onClick={handleSearch}>{t('Search')}</button>
      </div>

      <div className="search-results">
        {loading ? (
          <p>{t('Loading')}...</p>
        ) : results.length === 0 ? (
          <p>{t('No results found')}</p>
        ) : (
          results.map((movie) => (
            <div key={movie._id} className="movie-card">
              <h3>{movie.title}</h3>
              <p><strong>{t('Director')}:</strong> {movie.director}</p>
              <p><strong>{t('Genre')}:</strong> {movie.genre}</p>
              <p><strong>{t('Year')}:</strong> {movie.year}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage;
