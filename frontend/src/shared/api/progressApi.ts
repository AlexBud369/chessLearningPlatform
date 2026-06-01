import { axiosInstance } from './axiosInstance';
import type { Course } from './coursesApi';

export interface UserProgress {
  id: number;
  user_id: number;
  course_id: number;
  lesson_id: number | null;
  task_id: number | null;
  completed: boolean;
  score: number;
  completed_at: string | null;
}

export interface CourseCompletionStatus {
  totalLessons: number;
  completedLessons: number;
  percent: number;
}

export const progressApi = {
  markLessonCompleted: async (lessonId: number): Promise<UserProgress> => {
    const response = await axiosInstance.post('/progress/lesson', { lessonId });
    return response.data;
  },

  getCourseProgress: async (courseId: number): Promise<UserProgress[]> => {
    const response = await axiosInstance.get(`/progress/course/${courseId}`);
    return response.data;
  },

  getCourseCompletionStatus: async (courseId: number): Promise<CourseCompletionStatus> => {
    const response = await axiosInstance.get(`/progress/course/${courseId}/status`);
    return response.data;
  },

  getProgressSummary: async (): Promise<{ course: Course; completedLessons: number; totalLessons: number; percent: number }[]> => {
    const response = await axiosInstance.get('/progress/summary');
    return response.data;
  },

  getTaskChart: async (days = 30): Promise<{ days: number; timeline: TaskChartPoint[] }> => {
    const response = await axiosInstance.get('/progress/task-chart', { params: { days } });
    return response.data;
  },
};

export interface TaskChartPoint {
  date: string;
  count: number;
}