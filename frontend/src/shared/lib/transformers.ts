import { User, UserRaw } from '../types/user';

export const transformUser = (raw: UserRaw): User => ({
  id: raw.id,
  firstName: raw.first_name,
  lastName: raw.last_name,
  email: raw.email,
  role: raw.role,
  avatar: raw.avatar,
  isBlocked: raw.is_blocked,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});