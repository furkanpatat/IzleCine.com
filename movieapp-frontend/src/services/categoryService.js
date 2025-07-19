import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

const categoryService = {
  // Popüler filmleri getir (Redis cache ile)
  getPopularMovies: async (page = 1) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/popular`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  // Trend filmleri getir (Redis cache ile)
  getTrendingMovies: async (page = 1) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/trending`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  // Kategoriye göre filmleri getir (Redis cache ile)
  getMoviesByGenre: async (genreId, page = 1) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/genre/${genreId}`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      throw error;
    }
  },

  // Tüm kategorileri tek seferde getir (Redis cache ile)
  getAllCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all categories:', error);
      throw error;
    }
  },

  // Cache'i temizle (admin için) - admin auth geri getirildi
  clearCategoryCache: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_BASE_URL}/categories/cache`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error clearing category cache:', error);
      throw error;
    }
  }
};

export default categoryService; 