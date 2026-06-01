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
      const nextFilters: CourseFilters = { ...state.filters };
      let hasChanges = false;

      (Object.keys(action.payload) as Array<keyof CourseFilters>).forEach((key) => {
        const nextValue = action.payload[key];

        if (nextValue === undefined) {
          if (key in nextFilters) {
            delete (nextFilters as Record<string, unknown>)[key as string];
            hasChanges = true;
          }
          return;
        }

        const currentValue = nextFilters[key];

        if (currentValue !== nextValue) {
          (nextFilters as Record<string, unknown>)[key as string] = nextValue;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        state.filters = nextFilters;
      }
    },
    resetFilters: (state) => {
      if (Object.keys(state.filters).length > 0) {
        state.filters = {};
      }
    },
  },
});

export const { setFilters, resetFilters } = courseFiltersSlice.actions;
export default courseFiltersSlice.reducer;