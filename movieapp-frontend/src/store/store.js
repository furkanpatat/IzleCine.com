import { configureStore } from '@reduxjs/toolkit';
import IzleCineReducer from './izleCine'; // Küçük harfli dosya adıyla eşleşmeli

const store = configureStore({
  reducer: {
    IzleCineData: IzleCineReducer,
  },
});

export default store;
