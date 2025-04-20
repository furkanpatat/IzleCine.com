import { configureStore } from '@reduxjs/toolkit';
import IzleCineReducer from './izleCine'; // Küçük harfli dosya adıyla eşleşmeli
import watchlistReducer from './watchlistSlice';

const store = configureStore({
  reducer: {
    IzleCineData: IzleCineReducer,
    watchlist: watchlistReducer,
  },
});

export default store;
