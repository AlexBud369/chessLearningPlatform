import {axiosInstance} from './axiosInstance';

export interface AssignedCourse {
  id: number;
  student_id: number;
  course_id: number;
  assigned_by: number;
  assigned_at: string;
  course?: {
    id: number;
    title: string;
    description: string;
    cover_image: string | null;
  };
  assigner?: {
    id: number;
    username: string;
  };
}

export interface PaginatedAssignmentsResponse {
  assignments: AssignedCourse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TrainerAssignment {
  id: number;
  student_id: number;
  course_id: number;
  assigned_by: number;
  assigned_at: string;
  course?: {
    id: number;
    title: string;
    description: string;
    cover_image: string | null;
    difficulty?: number;
  };
  student?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const assignedCoursesApi = {
  assignCourse: (studentId: number, courseId: number) =>
    axiosInstance.post<AssignedCourse>('/assigned-courses/assign', { studentId, courseId }),

  assignCoursesBulk: (studentId: number, courseIds: number[]) =>
    axiosInstance.post<AssignedCourse[]>('/assigned-courses/assign/bulk', { studentId, courseIds }),

  removeAssignment: (studentId: number, courseId: number) =>
    axiosInstance.delete(`/assigned-courses/assign/${studentId}/${courseId}`),

  getTrainerAssignments: () =>
    axiosInstance.get<TrainerAssignment[]>('/assigned-courses/trainer/assignments'),

  getMyCourses: (params?: { page?: number; limit?: number }) =>
    axiosInstance.get<PaginatedAssignmentsResponse>('/assigned-courses/my-courses', { params }),

  getCourseStudents: (courseId: number) =>
    axiosInstance.get<{ id: number; username: string; email: string }[]>(`/assigned-courses/course/${courseId}/students`),

  checkAssigned: (studentId: number, courseId: number) =>
    axiosInstance.get<{ assigned: boolean }>(`/assigned-courses/check/${studentId}/${courseId}`),
};