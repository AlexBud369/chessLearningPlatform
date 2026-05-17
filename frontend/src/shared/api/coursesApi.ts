import { axiosInstance } from './axiosInstance';

export interface Course {
  id: number;
  title: string;
  description: string | null;
  theme_id: number;
  author_id: number;
  cover_image?: string;
  created_at: string;
  updated_at: string;
  theme?: { id: number; name: string };
  author?: { id: number; first_name: string; last_name: string };
  lessons?: Lesson[];
  isFavorite?: boolean;
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  content_type: 'video' | 'text';
  content: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CourseFilters {
  theme_id?: number;
  search?: string;
  sortBy?: 'title' | 'created_at';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface PaginatedCoursesResponse {
  courses: Course[];
  total: number;
  page: number;
  totalPages: number;
}

export const coursesApi = {
  fetchCourses: async (filters?: CourseFilters): Promise<PaginatedCoursesResponse> => {
    const params = new URLSearchParams();
    if (filters?.theme_id) params.append('theme_id', String(filters.theme_id));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    const response = await axiosInstance.get(`/courses?${params.toString()}`);
    return response.data;
  },

  fetchCourseById: async (id: number): Promise<Course> => {
    const response = await axiosInstance.get(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (data: Omit<Course, 'id' | 'created_at' | 'updated_at' | 'author_id' | 'cover_image'>): Promise<Course> => {
    const response = await axiosInstance.post('/courses', data);
    return response.data;
  },

  updateCourse: async (id: number, data: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>): Promise<Course> => {
    const response = await axiosInstance.put(`/courses/${id}`, data);
    return response.data;
  },

  deleteCourse: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/courses/${id}`);
  },

  uploadCourseCover: async (courseId: number, file: File): Promise<Course> => {
    const formData = new FormData();
    formData.append('cover', file);
    const response = await axiosInstance.post(`/courses/${courseId}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};