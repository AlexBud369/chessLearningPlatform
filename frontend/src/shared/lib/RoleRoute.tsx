import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from './hooks';
import type { UserRole } from '../types/user';
import { ROUTES } from '../constants/routes';

interface RoleRouteProps {
  roles?: UserRole[];
  requireAuth?: boolean;
}

export const RoleRoute = ({ roles, requireAuth = true }: RoleRouteProps) => {
  const user = useAppSelector((state) => state.user.user);

  if (requireAuth && !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};
