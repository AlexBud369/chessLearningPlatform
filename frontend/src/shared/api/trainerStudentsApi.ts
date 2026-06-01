import { axiosInstance } from './axiosInstance';

export interface TrainerStudentRelation {
  id: number;
  trainer_id: number;
  student_id: number;
  student: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string | null;
    is_blocked: boolean;
  };
}

export interface StudentProgressItem {
  student: TrainerStudentRelation['student'];
  coursesProgressPercent: number;
  completedCoursesCount: number;
  assignedCoursesCount: number;
  solvedTasksCount: number;
  lastActivityAt: string | null;
}

export const trainerStudentsApi = {
  getMyStudents: () => axiosInstance.get<TrainerStudentRelation[]>('/trainer/students'),

  getStudentsProgress: () => axiosInstance.get<StudentProgressItem[]>('/trainer/students/progress'),

  searchPlayers: (query: string) =>
    axiosInstance.get<TrainerStudentRelation['student'][]>('/trainer/students/search', { params: { q: query } }),

  addStudent: (studentId: number) =>
    axiosInstance.post<TrainerStudentRelation>('/trainer/students', { studentId }),

  removeStudent: (studentId: number) =>
    axiosInstance.delete(`/trainer/students/${studentId}`),

  getStudentGames: (studentId: number, params?: { page?: number; limit?: number }) =>
    axiosInstance.get<import('./gamesApi').PaginatedGamesResponse>(
      `/trainer/students/${studentId}/games`,
      { params }
    ),
};
