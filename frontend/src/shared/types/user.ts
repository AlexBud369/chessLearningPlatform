export type UserRole = 'player' | 'trainer' | 'admin';

export interface User {
  id: number;
  firstName: string;  
  lastName: string;  
  email: string;
  role: UserRole;
  avatar?: string | null;
  isBlocked?: boolean; 
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRaw {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  is_blocked?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserRaw;       
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: UserRole;      
}