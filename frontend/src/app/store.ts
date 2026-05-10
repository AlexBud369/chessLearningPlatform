import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../entities/user/model/store';
import themeReducer from '../entities/theme/model/store';
import courseReducer from '../entities/course/model/store';

export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
    courses: courseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;