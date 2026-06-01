import { Chess } from 'chess.js';
import { getSideToMove } from './chessFen';

export const parseSanTokens = (text: string): string[] => {
  if (!text.trim()) return [];
  const normalized = text.replace(/\d+\.\.\./g, ' ').replace(/\d+\./g, ' ').trim();
  return normalized.split(/[\s,;|]+/).filter(Boolean);
};

export const formatSanListAsPgnLine = (startFen: string, sans: string[]): string => {
  if (sans.length === 0) return '';

  try {
    const chess = new Chess(startFen);
    const parts: string[] = [];

    for (let index = 0; index < sans.length; index++) {
      const san = sans[index];
      const turn = chess.turn();
      const moveNum = chess.moveNumber();

      if (turn === 'w') {
        parts.push(`${moveNum}. ${san}`);
      } else if (index === 0) {
        parts.push(`${moveNum}... ${san}`);
      } else {
        parts.push(san);
      }

      const move = chess.move(san);
      if (!move) {
        return sans.join(' ');
      }
    }

    return parts.join(' ');
  } catch {
    return sans.join(' ');
  }
};

export const formatMoveToken = (startFen: string, ply: number, san: string): string => {
  const color = getSideToMove(startFen);
  let turn = color;
  let moveNum = new Chess(startFen).moveNumber();

  for (let i = 0; i < ply; i++) {
    if (turn === 'b') moveNum++;
    turn = turn === 'w' ? 'b' : 'w';
  }

  if (turn === 'w') return `${moveNum}. ${san}`;
  if (ply === 0) return `${moveNum}... ${san}`;
  return san;
};

export const sansFromPgnLine = (startFen: string, line: string): string[] => {
  const tokens = parseSanTokens(line);
  if (tokens.length === 0) return [];

  try {
    const chess = new Chess(startFen);
    const sans: string[] = [];

    for (const token of tokens) {
      const move = chess.move(token);
      if (!move) break;
      sans.push(move.san);
    }

    return sans;
  } catch {
    return tokens;
  }
};
