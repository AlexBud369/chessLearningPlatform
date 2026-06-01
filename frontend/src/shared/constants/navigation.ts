import { ROUTES } from './routes';
import type { UserRole } from '../types/user';

export type NavItem = {
  key: string;
  path: string;
  labelKey: string;
  roles?: UserRole[];
  requireAuth?: boolean;
  guestOnly?: boolean;
};

/** Основные страницы — в шапке и мобильном меню для всех */
export const PRIMARY_NAV: NavItem[] = [
  { key: 'home', path: ROUTES.HOME, labelKey: 'header.home' },
  { key: 'courses', path: ROUTES.COURSES, labelKey: 'header.courses' },
  { key: 'tasks', path: ROUTES.TASKS, labelKey: 'header.tasks' },
  { key: 'analysis', path: ROUTES.ANALYSIS, labelKey: 'header.analysis' },
];

/** Только для гостей */
export const GUEST_NAV: NavItem[] = [
  { key: 'login', path: ROUTES.LOGIN, labelKey: 'header.login', guestOnly: true },
  { key: 'register', path: ROUTES.REGISTER, labelKey: 'header.register', guestOnly: true },
];

export const isNavItemVisible = (
  item: NavItem,
  user: { role: UserRole } | null
): boolean => {
  if (item.guestOnly) return !user;
  if (item.requireAuth && !user) return false;
  if (item.roles && (!user || !item.roles.includes(user.role))) return false;
  return true;
};

export const getPublicNavItems = (user: { role: UserRole } | null): NavItem[] => {
  return [...PRIMARY_NAV, ...GUEST_NAV].filter((item) => isNavItemVisible(item, user));
};
