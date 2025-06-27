import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/users';

const authService = {
  register: async ({ username, email, password }) => {
    try {
      const response = await axios.post(API_BASE, { username, email, password });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Server error');
      }
    }
  },
  login: async ({ email, password }) => {
    try {
      const response = await axios.post(`${API_BASE}/login`, { email, password });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Login failed!');
      }
    }
  }
};

export default authService; 