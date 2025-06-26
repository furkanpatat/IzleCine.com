import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbService = {
  // Popüler filmleri getir
  getPopularMovies: async (page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
          api_key: API_KEY,
          language: 'tr-TR',
          page: page
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  // Film detaylarını getir
  getMovieDetails: async (movieId) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: API_KEY,
          language: 'tr-TR',
          append_to_response: 'videos,credits,similar'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // Popüler dizileri getir
  getPopularTVShows: async (page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/tv/popular`, {
        params: {
          api_key: API_KEY,
          language: 'tr-TR',
          page: page
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      throw error;
    }
  },

  // Dizi detaylarını getir
  getTVShowDetails: async (tvId) => {
    try {
      const response = await axios.get(`${BASE_URL}/tv/${tvId}`, {
        params: {
          api_key: API_KEY,
          language: 'tr-TR',
          append_to_response: 'videos,credits,similar'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      throw error;
    }
  },

  // Arama yap
  search: async (query, page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/search/multi`, {
        params: {
          api_key: API_KEY,
          language: 'tr-TR',
          query: query,
          page: page
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  },

  // Kategoriye göre filmleri getir
  getMoviesByGenre: async (genreId, page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/discover/movie`, {
        params: {
          api_key: API_KEY,
          language: 'tr-TR',
          with_genres: genreId,
          page: page,
          sort_by: 'popularity.desc'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      throw error;
    }
  },

  // Film türlerini getir
  getMovieGenres: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
        params: {
          api_key: API_KEY,
          language: 'tr-TR'
        }
      });
      return response.data.genres;
    } catch (error) {
      console.error('Error fetching movie genres:', error);
      throw error;
    }
  },

  // Trend olan filmleri getir
  getTrendingMovies: async (page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/trending/movie/week`, {
        params: {
          api_key: API_KEY,
          language: 'tr-TR',
          page: page
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  }
};

export default tmdbService; 