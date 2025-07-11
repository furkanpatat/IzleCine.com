import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ratingService from '../services/ratingService';

const initialState = {
  ratings: {}, // { movieId: { userId: rating } }
  loading: false,
  error: null
};

// ✅ Puan gönderme thunk'ı (ekle veya güncelle)
export const submitRating = createAsyncThunk(
  'ratings/submitRating',
  async ({ movieId, userId, rating }, thunkAPI) => {
    try {
      await ratingService.addOrUpdateRating({ movieId, userId, rating });
      return { movieId, userId, rating };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Puan gönderilemedi');
    }
  }
);

const ratingSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {
    removeRating: (state, action) => {
      const { movieId, userId } = action.payload;
      if (state.ratings[movieId]) {
        delete state.ratings[movieId][userId];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitRating.fulfilled, (state, action) => {
        const { movieId, userId, rating } = action.payload;
        if (!state.ratings[movieId]) {
          state.ratings[movieId] = {};
        }
        state.ratings[movieId][userId] = rating;
        state.loading = false;
      })
      .addCase(submitRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { removeRating } = ratingSlice.actions;
export default ratingSlice.reducer;
