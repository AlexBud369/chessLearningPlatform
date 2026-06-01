import { axiosInstance } from './axiosInstance';

export interface Game {
  id: number;
  user_id: number;
  pgn: string;
  result: string | null;
  date_played: string | null;
  title: string | null;
  student_note: string | null;
  shared_with_trainer: boolean;
  last_edited_by: number | null;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
  user?: { id: number; username: string; first_name?: string; last_name?: string; role?: string };
}

export interface PaginatedGamesResponse {
  games: Game[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AnalysisNode {
  id: number;
  game_id: number;
  user_id: number;
  parent_id: number | null;
  fen: string;
  move_from: string | null;
  move_to: string | null;
  comment: string | null;
  is_main: boolean;
  created_at: string;
  updated_at: string;
  children?: AnalysisNode[];
}

export interface SaveAnalysisRequest {
  nodes: Array<{
    fen: string;
    move_from?: string | null;
    move_to?: string | null;
    comment?: string | null;
    is_main?: boolean;
  }>;
}

export const gamesApi = {
  uploadPgn: (data: {
    pgn: string;
    result?: string;
    datePlayed?: string;
    title?: string;
    student_note?: string;
    shared_with_trainer?: boolean;
  }) => axiosInstance.post<Game>('/games/upload', data),

  getUserGames: (params?: { page?: number; limit?: number }) =>
    axiosInstance.get<PaginatedGamesResponse>('/games', { params }),

  getGameById: (id: number) => axiosInstance.get<Game>(`/games/${id}`),

  updateGame: (
    id: number,
    data: {
      pgn?: string;
      result?: string;
      datePlayed?: string;
      title?: string;
      student_note?: string;
      shared_with_trainer?: boolean;
    }
  ) => axiosInstance.put<Game>(`/games/${id}`, data),

  deleteGame: (id: number) => axiosInstance.delete(`/games/${id}`),
};

export const analysisApi = {
  getTree: (gameId: number) =>
    axiosInstance.get<AnalysisNode[]>(`/analysis/${gameId}/tree`),

  saveAnalysis: (gameId: number, nodes: SaveAnalysisRequest['nodes']) =>
    axiosInstance.post<AnalysisNode[]>(`/analysis/${gameId}/tree`, { nodes }),

  updateNodeComment: (nodeId: number, comment: string) =>
    axiosInstance.put<AnalysisNode>(`/analysis/nodes/${nodeId}`, { comment }),
};
