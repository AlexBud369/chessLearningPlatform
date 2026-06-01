import { Chess } from 'chess.js';
import type { ParsedMove } from './usePgnParser';

const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const buildPgnFromMoves = (
  startFen: string,
  moves: ParsedMove[],
  headers: Record<string, string> = {}
): string => {
  const chess = new Chess(startFen);
  moves.forEach((move) => chess.move(move.san));

  Object.entries(headers).forEach(([key, value]) => {
    if (value) chess.header(key, value);
  });

  if (startFen !== DEFAULT_FEN && !headers.FEN) {
    chess.header('FEN', startFen);
  }

  return chess.pgn();
};
