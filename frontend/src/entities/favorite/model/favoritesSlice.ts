import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  courseIds: number[];
  taskIds: number[];
}

const initialState: FavoritesState = {
  courseIds: [],
  taskIds: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setCoursesFavorites: (state, action: PayloadAction<number[]>) => {
      state.courseIds = action.payload;
    },
    setTasksFavorites: (state, action: PayloadAction<number[]>) => {
      state.taskIds = action.payload;
    },
    addCourseFavorite: (state, action: PayloadAction<number>) => {
      if (!state.courseIds.includes(action.payload)) {
        state.courseIds.push(action.payload);
      }
    },
    removeCourseFavorite: (state, action: PayloadAction<number>) => {
      state.courseIds = state.courseIds.filter((id) => id !== action.payload);
    },
    addTaskFavorite: (state, action: PayloadAction<number>) => {
      if (!state.taskIds.includes(action.payload)) {
        state.taskIds.push(action.payload);
      }
    },
    removeTaskFavorite: (state, action: PayloadAction<number>) => {
      state.taskIds = state.taskIds.filter((id) => id !== action.payload);
    },
  },
});

export const {
  setCoursesFavorites,
  setTasksFavorites,
  addCourseFavorite,
  removeCourseFavorite,
  addTaskFavorite,
  removeTaskFavorite,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;