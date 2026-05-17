import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../entities/user/model/store';
import themeReducer from '../entities/theme/model/store';
import courseFiltersReducer from '../entities/course/model/store';
import favoritesReducer from '../entities/favorite/model/favoritesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
    courses: courseFiltersReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;