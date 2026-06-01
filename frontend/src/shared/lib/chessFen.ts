import { Chess } from 'chess.js';

export const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const getSideToMove = (fen: string): 'w' | 'b' => {
  try {
    return new Chess(fen).turn();
  } catch {
    return 'w';
  }
};

export const switchSideToMove = (fen: string): string => {
  try {
    const parts = fen.trim().split(/\s+/);
    if (parts.length < 2) return fen;
    parts[1] = parts[1] === 'w' ? 'b' : 'w';
    return parts.join(' ');
  } catch {
    return fen;
  }
};

export const flipBoardOrientation = (orientation: 'white' | 'black'): 'white' | 'black' =>
  orientation === 'white' ? 'black' : 'white';

export const getMoveColorAtPly = (startFen: string, ply: number): 'w' | 'b' => {
  const start = getSideToMove(startFen);
  if (ply % 2 === 0) return start;
  return start === 'w' ? 'b' : 'w';
};
