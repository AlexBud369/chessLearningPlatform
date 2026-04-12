import { createTheme, Theme } from '@mui/material/styles';

export const createLightTheme = (): Theme =>
  createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#769656', light: '#8fad6a', dark: '#5a7a3e', contrastText: '#ffffff' },
      secondary: { main: '#b58863', light: '#c9a07e', dark: '#9b6f4a', contrastText: '#ffffff' },
      background: { default: '#eeeed2', paper: '#ffffff' },
      text: { primary: '#333333', secondary: '#555555' },
      error: { main: '#d32f2f' },
      warning: { main: '#ff9800' },
      info: { main: '#1976d2' },
      success: { main: '#2e7d32' },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
      fontSize: 16, 
      h1: { fontSize: '2.5rem', fontWeight: 700 },
      h2: { fontSize: '2rem', fontWeight: 600 },
      h3: { fontSize: '1.75rem', fontWeight: 600 },
      h4: { fontSize: '1.5rem', fontWeight: 500 },
      h5: { fontSize: '1.25rem', fontWeight: 500 },
      h6: { fontSize: '1.125rem', fontWeight: 500 },
      body1: { fontSize: '1rem' },
      body2: { fontSize: '0.875rem' },
    },
    components: {
      MuiButton: { styleOverrides: { root: { borderRadius: 8, textTransform: 'none' } } },
      MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
    },
  });

export const createDarkTheme = (): Theme =>
  createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#a0c05e', light: '#b5d07a', dark: '#7a9e42', contrastText: '#1e1e1e' },
      secondary: { main: '#c9a07e', light: '#d6b69a', dark: '#a87a5a', contrastText: '#1e1e1e' },
      background: { default: '#1e1e1e', paper: '#2d2d2d' },
      text: { primary: '#e0e0e0', secondary: '#b0b0b0' },
      error: { main: '#f44336' },
      warning: { main: '#ffa726' },
      info: { main: '#29b6f6' },
      success: { main: '#66bb6a' },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
    },
    components: {
      MuiButton: { styleOverrides: { root: { borderRadius: 8, textTransform: 'none' } } },
      MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
    },
  });