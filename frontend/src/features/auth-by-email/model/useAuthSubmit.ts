import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../shared/lib/hooks';
import { setUser, setLoading, setError } from '../../../entities/user/model/store';
import { tokenStorage } from '../../../shared/lib/tokenStorage';
import { transformUser } from '../../../shared/lib/transformers';
import { parseAuthError } from '../../../shared/lib/errorParser';
import { useTranslation } from 'react-i18next';

type AuthAction<T> = (data: T) => Promise<any>;

export const useAuthSubmit = <T>(action: AuthAction<T>) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const submit = async (data: T): Promise<{ success: boolean; error?: string; errorType?: 'field' | 'root' }> => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await action(data);
      tokenStorage.set(response.accessToken);
      dispatch(setUser(transformUser(response.user)));
      navigate('/profile');
      return { success: true };
    } catch (err: any) {
      const status = err.response?.status;
      const errorMessage = parseAuthError(err, t);
      
      const errorType = (status === 409 || status === 401) ? 'root' : 'field';
      
      dispatch(setError(errorMessage));
      
      return { success: false, error: errorMessage, errorType };
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { submit };
};