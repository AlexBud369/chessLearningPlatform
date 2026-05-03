import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { coursesApi, Course, CourseFilters } from '../../../shared/api/coursesApi';

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  filters: CourseFilters;
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  filters: {},
  loading: false,
  error: null,
};

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (filters: CourseFilters | undefined, { getState }) => {
    const state = getState() as { courses: CourseState };
    const activeFilters = filters || state.courses.filters;
    return await coursesApi.fetchCourses(activeFilters);
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (id: number) => {
    return await coursesApi.fetchCourseById(id);
  }
);

export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at' | 'author_id'>) => {
    return await coursesApi.createCourse(courseData);
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, data }: { id: number; data: Partial<Course> }) => {
    return await coursesApi.updateCourse(id, data);
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id: number) => {
    await coursesApi.deleteCourse(id);
    return id;
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<CourseFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {};
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch courses';
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch course';
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload);
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.courses[index] = action.payload;
        if (state.currentCourse?.id === action.payload.id) state.currentCourse = action.payload;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(c => c.id !== action.payload);
        if (state.currentCourse?.id === action.payload) state.currentCourse = null;
      });
  },
});

export const { setFilters, resetFilters, clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;