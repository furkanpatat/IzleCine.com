import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bannerData: []
};

export const IzleCine = createSlice({
  name: 'IzleCine',
  initialState,
  reducers: {
    setBannerData: (state, action) => {
      state.bannerData = action.payload;
    }
  }
});

export const { setBannerData } = IzleCine.actions;
export default IzleCine.reducer;
