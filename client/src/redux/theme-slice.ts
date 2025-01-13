// src/redux/themeSlice.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state for the theme
const initialState = {
  theme: 'light',  // Default theme is 'light'
};

// Create a slice for theme management
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
  },
});

// Export the action and reducer
export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
