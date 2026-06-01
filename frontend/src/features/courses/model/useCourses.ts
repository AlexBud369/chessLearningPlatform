import { useState, useCallback } from 'react';
import { coursesApi, Course, CourseFilters, PaginatedCoursesResponse } from '../../../shared/api/coursesApi';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  const loadCourses = useCallback(async (filters?: CourseFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response: PaginatedCoursesResponse = await coursesApi.fetchCourses(filters);
      setCourses(response.courses);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setPage(response.page);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCourseById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await coursesApi.fetchCourseById(id);
      setCurrentCourse(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCurrentCourse = useCallback(() => {
    setCurrentCourse(null);
  }, []);

  return {
    courses,
    currentCourse,
    loading,
    error,
    total,
    totalPages,
    page,
    loadCourses,
    loadCourseById,
    clearCurrentCourse,
  };
};
