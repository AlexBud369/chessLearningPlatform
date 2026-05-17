import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { setFavorites, addFavorite, removeFavorite } from '../../../entities/favorite/model/favoritesSlice';
import { favoritesApi } from '../../../shared/api/favoritesApi';
import { toast } from 'react-toastify';

export const useFavorites = () => {
  const dispatch = useDispatch();
  const favoriteIds = useSelector((state: RootState) => state.favorites.favoriteIds);

  const loadFavorites = useCallback(async () => {
    try {
      const favorites = await favoritesApi.getFavorites('course');
      const ids = favorites.map(fav => fav.item_id);
      dispatch(setFavorites(ids));
    } catch (error) {
      console.error('Failed to load favorites', error);
    }
  }, [dispatch]);

  const toggleFavorite = useCallback(async (courseId: number) => {
    const isFav = favoriteIds.includes(courseId);
    try {
      if (isFav) {
        await favoritesApi.removeFavorite('course', courseId);
        dispatch(removeFavorite(courseId));
        toast.success('Removed from favorites');
      } else {
        await favoritesApi.addFavorite('course', courseId);
        dispatch(addFavorite(courseId));
        toast.success('Added to favorites');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update favorites');
    }
  }, [dispatch, favoriteIds]);

  const isFavorite = useCallback((courseId: number) => {
    return favoriteIds.includes(courseId);
  }, [favoriteIds]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favoriteIds,
    toggleFavorite,
    isFavorite,
    loadFavorites,
  };
};