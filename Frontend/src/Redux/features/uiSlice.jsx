
import { createSlice } from '@reduxjs/toolkit';



const initialState  = {
  isMobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenuOpen: (state, action) => {
      state.isMobileMenuOpen = action.payload;
    },
  },
});

export const { toggleMobileMenu, setMobileMenuOpen } = uiSlice.actions;
export default uiSlice.reducer;