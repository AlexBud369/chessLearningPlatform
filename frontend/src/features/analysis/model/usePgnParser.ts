import { useCallback } from 'react';
import { Chess } from 'chess.js';

export interface ParsedMove {
  index: number;
  san: string;
  fen: string;
}

export interface ParsedGame {
  headers: Record<string, string>;
  moves: ParsedMove[];
  startFen: string;
}

export const usePgnParser = () => {
  const parsePgn = useCallback((pgn: string): ParsedGame | null => {
    try {
      const chess = new Chess();
      chess.loadPgn(pgn);

      const headers: Record<string, string> = {};
      const rawHeaders = chess.header();
      if (rawHeaders && typeof rawHeaders === 'object') {
        Object.assign(headers, rawHeaders);
      }

      const history = chess.history();

      chess.reset();

      const startFen = headers['FEN'] || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

      if (headers['FEN']) {
        chess.load(headers['FEN']);
      } else {
        chess.reset();
      }

      const moves: ParsedMove[] = [];

      history.forEach((san, index) => {
        chess.move(san);
        moves.push({
          index,
          san,
          fen: chess.fen(),
        });
      });

      return { headers, moves, startFen };
    } catch {
      return null;
    }
  }, []);

  const validatePgn = useCallback((pgn: string): boolean => {
    try {
      const chess = new Chess();
      chess.loadPgn(pgn);
      return chess.history().length > 0;
    } catch {
      return false;
    }
  }, []);

  return { parsePgn, validatePgn };
};