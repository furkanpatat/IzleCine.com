import axios from 'axios';

// Create a dedicated axios instance for user profile requests to production backend
const apiAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const apiService = {
  // User profile endpoints
  getUserProfile: async (token) => {
    try {
      const response = await apiAxios.get('/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Authentication failed');
      } else {
        throw new Error('Failed to fetch user profile');
      }
    }
  },

  updateUserProfile: async (token, profileData) => {
    try {
      console.log('Updating user profile with data:', profileData);
      console.log('Using token:', token ? 'exists' : 'missing');
      console.log('API URL:', process.env.REACT_APP_API_URL);

      const response = await apiAxios.put('/users/profile', profileData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Profile update error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Profile update failed');
      } else {
        throw new Error('Profile update failed');
      }
    }
  },

  updateUserProfilePatch: async (token, profileData) => {
    try {
      const response = await apiAxios.patch('/users/profile', profileData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Profile update failed');
      } else {
        throw new Error('Profile update failed');
      }
    }
  },

  checkProfileComplete: async (token) => {
    try {
      const userProfile = await apiService.getUserProfile(token);
      return !!(userProfile.firstName && userProfile.lastName);
    } catch (error) {
      console.error('Error checking profile completion:', error);
      return false;
    }
  },

  addMovie: async (token, movieData) => {
    try {
      const response = await apiAxios.post('/admin/add-movie', movieData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Film eklenemedi');
    }
  },

  getAdminGeneralStats: async (token) => {
    try {
      const response = await apiAxios.get('/admin/general-stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Genel istatistikler alınamadı');
    }
  },

  getAdminUsers: async (token) => {
    try {
      const response = await apiAxios.get('/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.filter(u => u.role === 'admin');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Admin kullanıcılar alınamadı');
    }
  },

  getAdminMovies: async (token) => {
    const response = await apiAxios.get('/admin/all-movies', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deleteAdminMovie: async (token, movieId) => {
    const response = await apiAxios.delete(`/admin/delete-movie/${movieId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // 🎯 Film arama fonksiyonu
  searchMovies: async (query, filters = {}) => {
    try {
      const response = await apiAxios.get('/movies/search', {
        params: { query, ...filters }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Film arama başarısız');
    }
  }
};

export default apiService;
