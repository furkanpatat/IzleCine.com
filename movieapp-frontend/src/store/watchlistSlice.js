import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: []
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    removeFromWatchlist: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearWatchlist: (state) => {
      state.items = [];
    }
  }
});

export const { addToWatchlist, removeFromWatchlist, clearWatchlist } = watchlistSlice.actions;

export default watchlistSlice.reducer; 