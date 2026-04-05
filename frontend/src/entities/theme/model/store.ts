import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeMode, THEME_MODES } from '../../../shared/constants/theme';
import { themeStorage } from '../../../shared/lib/themeStorage';

interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = {
  mode: themeStorage.get(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      themeStorage.set(action.payload);
    },
    toggleTheme: (state) => {
      const newMode = state.mode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;
      state.mode = newMode;
      themeStorage.set(newMode);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;