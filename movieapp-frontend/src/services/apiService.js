import axios from 'axios';

// Create a dedicated axios instance for user profile requests to production backend
const apiAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api', // Use production URL or fallback to proxy
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

  // Check if user profile is complete
  checkProfileComplete: async (token) => {
    try {
      const userProfile = await apiService.getUserProfile(token);
      return !!(userProfile.firstName && userProfile.lastName);
    } catch (error) {
      console.error('Error checking profile completion:', error);
      return false;
    }
  }
};

export default apiService; 