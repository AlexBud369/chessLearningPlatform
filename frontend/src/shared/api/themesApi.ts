import { axiosInstance } from './axiosInstance';

export interface Theme {
  id: number;
  name: string;
  description: string | null;
}

export const themesApi = {
  fetchThemes: async (): Promise<Theme[]> => {
    const response = await axiosInstance.get('/themes');
    return response.data;
  },
};