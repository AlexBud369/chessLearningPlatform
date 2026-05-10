import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/lib/hooks';
import { setFilters, resetFilters } from '../../../entities/course/model/store';
import type { CourseFilters } from '../../../shared/api/coursesApi';
import type { RootState } from '../../../app/store';

const STORAGE_KEY = 'course_filters';

export const useCourseFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state: RootState) => state.courses.filters);

  useEffect(() => {
    const savedFilters = localStorage.getItem(STORAGE_KEY);
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters) as CourseFilters;
        dispatch(setFilters(parsed));
      } catch (e) {
        console.error('Failed to parse saved filters', e);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const updateFilter = (key: keyof CourseFilters, value: any) => {
    dispatch(setFilters({ [key]: value || undefined }));
  };

  const clearFilters = () => {
    dispatch(resetFilters());
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    filters,
    updateFilter,
    clearFilters,
  };
};