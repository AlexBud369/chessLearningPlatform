import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { progressApi } from '../../../shared/api/progressApi';

export const useLessonProgress = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const markLessonCompleted = async (lessonId: number, onSuccess?: () => void) => {
    setLoading(true);
    try {
      await progressApi.markLessonCompleted(lessonId);
      toast.success(t('lessonProgress.success'));
      onSuccess?.();
    } catch (err: any) {
      const message = err.response?.data?.message || t('lessonProgress.error');
      toast.error(message);
      console.error('Failed to mark lesson completed:', err);
    } finally {
      setLoading(false);
    }
  };

  return { markLessonCompleted, loading };
};