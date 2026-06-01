export type FavoriteItemType = 'course' | 'lesson' | 'task';

export interface Favorite {
  id: number;
  user_id: number;
  item_type: FavoriteItemType;
  item_id: number;
  created_at: string;
}