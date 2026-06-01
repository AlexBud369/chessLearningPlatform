export interface Task {
  id: number;
  title?: string | null;
  fen: string;
  solution: string;
  difficulty: number;
  theme_id: number;
  author_id: number;
  created_at: string;
  updated_at: string;
  theme?: {
    id: number;
    name: string;
  };
}

export interface SolveTaskRequest {
  move: string;
}

export interface SolveTaskResponse {
  correct: boolean;
  solution: string | null;
}

export interface UserTaskResult {
  id: number;
  user_id: number;
  task_id: number;
  solved: boolean;
  attempts: number;
  solved_at: string | null;
  created_at: string;
  updated_at: string;
}