export const DIFFICULTY_LEVELS = [1, 2, 3, 4, 5] as const;

export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const getDifficultyColor = (
  difficulty: number
): 'default' | 'info' | 'success' | 'warning' | 'error' | 'secondary' => {
  if (difficulty <= 1) return 'success';
  if (difficulty === 2) return 'info';
  if (difficulty === 3) return 'warning';
  if (difficulty >= 4) return 'error';
  return 'default';
};

export const getDifficultyLabelKey = (difficulty: number): string => `difficulty.level${difficulty}`;
