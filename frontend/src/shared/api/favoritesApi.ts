import { axiosInstance } from './axiosInstance';
import { Favorite } from '../types/favorite';

export const favoritesApi = {
  getFavorites: async (itemType?: string): Promise<Favorite[]> => {
    const params = itemType ? `?itemType=${itemType}` : '';
    const response = await axiosInstance.get(`/favorites${params}`);
    return response.data;
  },

  addFavorite: async (itemType: string, itemId: number): Promise<Favorite> => {
    const response = await axiosInstance.post(`/favorites/${itemType}/${itemId}`);
    return response.data;
  },

  removeFavorite: async (itemType: string, itemId: number): Promise<void> => {
    await axiosInstance.delete(`/favorites/${itemType}/${itemId}`);
  },
};