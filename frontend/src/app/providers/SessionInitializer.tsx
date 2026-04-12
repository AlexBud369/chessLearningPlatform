import React, { useEffect } from 'react';
import { useAppDispatch } from '../../shared/lib/hooks';
import { setUser, setLoading, setError } from '../../entities/user/model/store';
import { authApi } from '../../shared/api/authApi';
import { tokenStorage } from '../../shared/lib/tokenStorage';
import { transformUser } from '../../shared/lib/transformers';
import { ERROR_MESSAGES } from '../../shared/constants';

export const SessionInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      const token = tokenStorage.get();
      if (!token) {
        dispatch(setLoading(false));
        return;
      }

      dispatch(setLoading(true));
      try {
        const userRaw = await authApi.getProfile();
        dispatch(setUser(transformUser(userRaw)));
      } catch (error: any) {
        tokenStorage.remove();
        dispatch(setUser(null));
        const message = error.response?.data?.message || ERROR_MESSAGES.FAILED_RESTORE;
        dispatch(setError(message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    restoreSession();
  }, [dispatch]);

  return <>{children}</>;
};