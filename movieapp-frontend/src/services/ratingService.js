import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/ratings` : '/api/ratings';

const ratingService = {
  addOrUpdateRating: async ({ userId, movieId, rating }) => {
    const response = await axios.post(`${API_BASE}`, {
      userId,
      movieId,
      rating
    });
    return response.data;
  },

  getAverageRating: async (movieId) => {
    const response = await axios.get(`${API_BASE}/${movieId}`);
    return response.data;
  },
  getUserRating: async (movieId, userId) => {
  const response = await axios.get(`${API_BASE}/${movieId}/${userId}`);
  return response.data.rating;
  }

};

export default ratingService;
