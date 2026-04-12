import { THEME_STORAGE_KEY, THEME_MODES, ThemeMode } from '../constants/theme';

export const themeStorage = {
  get: (): ThemeMode => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === THEME_MODES.LIGHT || stored === THEME_MODES.DARK) {
      return stored;
    }
    // По умолчанию светлая тема
    return THEME_MODES.LIGHT;
  },
  set: (mode: ThemeMode) => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  },
  remove: () => {
    localStorage.removeItem(THEME_STORAGE_KEY);
  },
};