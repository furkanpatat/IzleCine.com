import axios from 'axios';

// Create a dedicated axios instance for authentication requests to production backend
const authAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/users` : '/api/users', // Use production URL or fallback to proxy
  headers: {
    'Content-Type': 'application/json'
  }
});

const authService = {
  register: async ({ username, email, password }) => {
    try {
      console.log('Registering with:', { username, email, password: '***' });
      console.log('API URL:', process.env.REACT_APP_API_URL);

      const response = await authAxios.post('', { username, email, password });
      console.log('Register response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Register error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });

      if (error.response && error.response.status === 400) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Server error during registration');
      }
    }
  },
  login: async ({ email, password }) => {
    try {
      const response = await authAxios.post('/login', { email, password });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Login failed!');
      }
    }
  },
  forgotPassword: async ({ email }) => {
    try {
      const response = await authAxios.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error(error.response.data.message);
      } else if (error.response && error.response.status === 404) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Şifre sıfırlama işlemi başarısız!');
      }
    }
  },
  resetPassword: async ({ token, newPassword }) => {
    try {
      const response = await authAxios.post('/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Şifre sıfırlama işlemi başarısız!');
      }
    }
  },
  logout: () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  }
};

export default authService; 