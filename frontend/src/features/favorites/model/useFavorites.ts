import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { RootState } from '../../../app/store';
import {
  setCoursesFavorites,
  setTasksFavorites,
  addCourseFavorite,
  removeCourseFavorite,
  addTaskFavorite,
  removeTaskFavorite,
} from '../../../entities/favorite/model/favoritesSlice';
import { favoritesApi } from '../../../shared/api/favoritesApi';

type FavoriteType = 'course' | 'task';

export const useFavorites = (itemType: FavoriteType = 'course') => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const courseIds = useSelector((state: RootState) => state.favorites.courseIds);
  const taskIds = useSelector((state: RootState) => state.favorites.taskIds);

  const currentIds = itemType === 'course' ? courseIds : taskIds;

  const loadFavorites = useCallback(async () => {
    try {
      const favorites = await favoritesApi.getFavorites(itemType);
      const ids = favorites.map((fav) => fav.item_id);

      if (itemType === 'course') {
        dispatch(setCoursesFavorites(ids));
      } else {
        dispatch(setTasksFavorites(ids));
      }
    } catch (error) {
      console.error(`Failed to load ${itemType} favorites`, error);
    }
  }, [dispatch, itemType]);

  const toggleFavorite = useCallback(
    async (itemId: number) => {
      const isFav = currentIds.includes(itemId);

      try {
        if (isFav) {
          await favoritesApi.removeFavorite(itemType, itemId);

          if (itemType === 'course') {
            dispatch(removeCourseFavorite(itemId));
          } else {
            dispatch(removeTaskFavorite(itemId));
          }

          toast.success(t('favorites.removed'));
        } else {
          await favoritesApi.addFavorite(itemType, itemId);

          if (itemType === 'course') {
            dispatch(addCourseFavorite(itemId));
          } else {
            dispatch(addTaskFavorite(itemId));
          }

          toast.success(t('favorites.added'));
        }
      } catch (error: any) {
        toast.error(error.message || t('favorites.error'));
      }
    },
    [dispatch, currentIds, itemType, t]
  );

  const isFavorite = useCallback(
    (itemId: number) => currentIds.includes(itemId),
    [currentIds]
  );

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favoriteIds: currentIds,
    toggleFavorite,
    isFavorite,
    loadFavorites,
  };
};