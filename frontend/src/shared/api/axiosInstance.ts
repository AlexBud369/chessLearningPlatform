import axios from 'axios';
import { API_BASE_URL } from '../config/clientConfig';
import { tokenStorage } from '../lib/tokenStorage';
import { authApi } from './authApi';
import { HTTP_STATUS } from '../constants';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh'];

axiosInstance.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint => originalRequest.url?.startsWith(endpoint));

    if (
      error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { accessToken } = await authApi.refresh();
        tokenStorage.set(accessToken);
        processQueue(null, accessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        tokenStorage.remove();
        processQueue(refreshError, null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);