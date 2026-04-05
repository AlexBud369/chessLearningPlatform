import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { createLightTheme, createDarkTheme } from '../../app/styles/themes';
import { THEME_MODES } from '../../shared/constants/theme';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const theme = mode === THEME_MODES.LIGHT ? createLightTheme() : createDarkTheme();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};