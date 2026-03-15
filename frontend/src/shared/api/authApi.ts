import { axiosInstance } from './axiosInstance';
import { LoginCredentials, RegisterCredentials, AuthResponse, UserRaw } from '../types/user';

export const authApi = {
  async register(credentials: RegisterCredentials) {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },

  async login(credentials: LoginCredentials) {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async logout() {
    await axiosInstance.post('/auth/logout');
  },

  async refresh() {
    const response = await axiosInstance.post<{ accessToken: string }>('/auth/refresh');
    return response.data;
  },

  async getProfile() {
    const response = await axiosInstance.get<{ user: UserRaw }>('/auth/profile');
    return response.data.user;
  },
};