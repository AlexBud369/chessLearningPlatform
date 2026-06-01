import { axiosInstance } from './axiosInstance';
import type { Lesson } from './coursesApi';

export interface LessonPayload {
  course_id: number;
  title: string;
  content_type: 'video' | 'text';
  content: string;
  order_index?: number;
}

export const lessonsApi = {
  getByCourseId: (courseId: number) =>
    axiosInstance.get<Lesson[]>(`/lessons/course/${courseId}`),

  getById: (id: number) => axiosInstance.get<Lesson>(`/lessons/${id}`),

  create: (data: LessonPayload) => axiosInstance.post<Lesson>('/lessons', data),

  update: (id: number, data: Partial<LessonPayload>) =>
    axiosInstance.put<Lesson>(`/lessons/${id}`, data),

  delete: (id: number) => axiosInstance.delete(`/lessons/${id}`),
};
