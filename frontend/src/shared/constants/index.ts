export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
} as const;

export const API_ENDPOINTS = {
  REFRESH: '/auth/refresh',
} as const;

export const ERROR_MESSAGES = {
  SESSION_EXPIRED: 'Session expired. Please login again.',
  FAILED_RESTORE: 'Failed to restore session',
} as const;