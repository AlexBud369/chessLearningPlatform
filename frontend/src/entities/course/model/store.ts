import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CourseFilters } from '../../../shared/api/coursesApi';

interface CourseFiltersState {
  filters: CourseFilters;
}

const initialState: CourseFiltersState = {
  filters: {},
};

const courseFiltersSlice = createSlice({
  name: 'courseFilters',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<CourseFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {};
    },
  },
});

export const { setFilters, resetFilters } = courseFiltersSlice.actions;
export default courseFiltersSlice.reducer;