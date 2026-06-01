import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/lib/hooks';
import { setFilters, resetFilters } from '../../../entities/course/model/store';
import type { CourseFilters } from '../../../shared/api/coursesApi';
import type { RootState } from '../../../app/store';

const STORAGE_KEY = 'course_filters';

let hasInitializedCourseFilters = false;

export const useCourseFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state: RootState) => state.courses.filters);
  const skipFirstSaveRef = useRef(true);

  useEffect(() => {
    if (hasInitializedCourseFilters) {
      return;
    }

    hasInitializedCourseFilters = true;

    const savedFilters = localStorage.getItem(STORAGE_KEY);
    if (!savedFilters) {
      return;
    }

    try {
      const parsed = JSON.parse(savedFilters) as CourseFilters;
      dispatch(setFilters(parsed));
    } catch (e) {
      console.error('Failed to parse saved filters', e);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [dispatch]);

  useEffect(() => {
    if (skipFirstSaveRef.current) {
      skipFirstSaveRef.current = false;
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const updateFilter = useCallback(
    (key: keyof CourseFilters, value: CourseFilters[keyof CourseFilters] | undefined) => {
      dispatch(setFilters({ [key]: value } as Partial<CourseFilters>));
    },
    [dispatch]
  );

  const clearFilters = useCallback(() => {
    dispatch(resetFilters());
    localStorage.removeItem(STORAGE_KEY);
  }, [dispatch]);

  const setPage = useCallback(
    (page: number) => {
      updateFilter('page', page);
    },
    [updateFilter]
  );

  const setLimit = useCallback(
    (limit: number) => {
      updateFilter('limit', limit);
    },
    [updateFilter]
  );

  return {
    filters,
    updateFilter,
    clearFilters,
    setPage,
    setLimit,
  };
};