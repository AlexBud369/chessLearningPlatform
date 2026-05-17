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

  const createCourse = useCallback(async (courseData: any) => {
    try {
      setLoading(true);
      const newCourse = await coursesApi.createCourse(courseData);
      setCourses(prev => [...prev, newCourse]);
      return newCourse;
    } catch (err: any) {
      setError(err.message || 'Failed to create course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCourse = useCallback(async (id: number, data: Partial<Course>) => {
    try {
      setLoading(true);
      const updated = await coursesApi.updateCourse(id, data);
      setCourses(prev => prev.map(c => c.id === id ? updated : c));
      if (currentCourse?.id === id) setCurrentCourse(updated);
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentCourse]);

  const deleteCourse = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await coursesApi.deleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      if (currentCourse?.id === id) setCurrentCourse(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentCourse]);

  const uploadCover = useCallback(async (courseId: number, file: File) => {
    try {
      setLoading(true);
      const updatedCourse = await coursesApi.uploadCourseCover(courseId, file);
      setCourses(prev => prev.map(c => c.id === courseId ? updatedCourse : c));
      if (currentCourse?.id === courseId) setCurrentCourse(updatedCourse);
      return updatedCourse;
    } catch (err: any) {
      setError(err.message || 'Failed to upload cover');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentCourse]);

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
    createCourse,
    updateCourse,
    deleteCourse,
    uploadCover,
  };
};