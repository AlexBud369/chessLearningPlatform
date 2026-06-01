import { axiosInstance } from './axiosInstance';

export interface AdminUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'player' | 'trainer' | 'admin';
  is_blocked: boolean;
  created_at: string;
}

export interface PaginatedUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const adminApi = {
  getUsers: (params?: { page?: number; limit?: number }) =>
    axiosInstance.get<PaginatedUsersResponse>('/admin/users', { params }),

  setBlockedStatus: (userId: number, isBlocked: boolean) =>
    axiosInstance.patch<AdminUser>(`/admin/users/${userId}/block`, { isBlocked }),
};
