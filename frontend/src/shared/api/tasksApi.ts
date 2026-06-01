import { axiosInstance } from './axiosInstance';
import type { Task, SolveTaskResponse } from '../types/task';
import type { CompletionStatus } from './coursesApi';

export interface PaginatedTasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const tasksApi = {
  getDifficulties: () => axiosInstance.get<number[]>('/tasks/difficulties'),

  getTasks: (params: {
    page?: number;
    limit?: number;
    difficulty?: number;
    themeId?: number;
    search?: string;
    status?: CompletionStatus;
  }) => axiosInstance.get<PaginatedTasksResponse>('/tasks', { params }),

  getTaskById: (id: number) => axiosInstance.get<Task>(`/tasks/${id}`),

  solveTask: (id: number, move: string) =>
    axiosInstance.post<SolveTaskResponse>(`/tasks/${id}/solve`, { move }),

  completeTask: (id: number) =>
    axiosInstance.post<SolveTaskResponse>(`/tasks/${id}/complete`, {}),

  createTask: (data: {
    title?: string;
    fen: string;
    solution: string;
    difficulty: number;
    theme_id: number;
  }) => axiosInstance.post<Task>('/tasks', data),

  updateTask: (
    id: number,
    data: Partial<{
      title: string;
      fen: string;
      solution: string;
      difficulty: number;
      theme_id: number;
    }>
  ) => axiosInstance.put<Task>(`/tasks/${id}`, data),

  deleteTask: (id: number) => axiosInstance.delete(`/tasks/${id}`),
};