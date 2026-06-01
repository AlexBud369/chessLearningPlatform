import { Chess } from 'chess.js';
import {
  formatSanListAsPgnLine,
  parseSanTokens,
  sansFromPgnLine,
} from './formatMoveNotation';
import { getMoveColorAtPly } from './chessFen';

export type PlayerSide = 'white' | 'black';

const PLAYER_META = /^@player:(white|black)@\s*/i;

export const parseSolutionMoves = (solution: string): string[] => {
  const { body } = stripSolutionMeta(solution);
  if (!body.trim()) return [];

  if (/\d+\./.test(body)) {
    return parseSanTokens(body);
  }

  const normalized = body.replace(/\d+\.(\.\.)?/g, ' ').trim();
  return normalized.split(/[\s,;|]+/).filter(Boolean);
};

export const stripSolutionMeta = (solution: string): { playerSide: PlayerSide; body: string } => {
  let playerSide: PlayerSide = 'white';
  let body = solution.trim();
  const match = body.match(PLAYER_META);
  if (match) {
    playerSide = match[1].toLowerCase() as PlayerSide;
    body = body.slice(match[0].length).trim();
  }
  return { playerSide, body };
};

export const formatSolutionWithMeta = (
  moves: string[],
  startFen: string,
  playerSide: PlayerSide
): string => {
  const line = formatSanListAsPgnLine(startFen, moves);
  return `@player:${playerSide}@${line ? ` ${line}` : ''}`.trim();
};

export const parseSolutionWithMeta = (
  solution: string,
  startFen: string
): { playerSide: PlayerSide; moves: string[]; displayLine: string } => {
  const { playerSide, body } = stripSolutionMeta(solution);
  const moves = body.includes('.') ? sansFromPgnLine(startFen, body) : parseSolutionMoves(body);
  return {
    playerSide,
    moves,
    displayLine: formatSanListAsPgnLine(startFen, moves),
  };
};

export const hasSolutionMoves = (solution: string, startFen: string): boolean =>
  parseSolutionWithMeta(solution, startFen).moves.length > 0;

export const formatSolutionMoves = (moves: string[]): string => moves.join(' ');

export const isValidFen = (fen: string): boolean => {
  try {
    new Chess(fen);
    return true;
  } catch {
    return false;
  }
};

export const getFenAfterMoves = (startFen: string, moves: string[], count: number): string => {
  const chess = new Chess(startFen);
  for (let i = 0; i < count && i < moves.length; i++) {
    chess.move(moves[i]);
  }
  return chess.fen();
};

export const isExpectedMove = (fen: string, from: string, to: string, expectedSan: string): boolean => {
  try {
    const userBoard = new Chess(fen);
    const userMove = userBoard.move({ from, to, promotion: 'q' });
    if (!userMove) return false;

    const expectedBoard = new Chess(fen);
    const expectedMove = expectedBoard.move(expectedSan);
    if (!expectedMove) return false;

    return userMove.from === expectedMove.from && userMove.to === expectedMove.to;
  } catch {
    return false;
  }
};

export const tryMoveFromSquares = (
  fen: string,
  from: string,
  to: string
): { san: string; fen: string } | null => {
  try {
    const chess = new Chess(fen);
    const move = chess.move({ from, to, promotion: 'q' });
    if (!move) return null;
    return { san: move.san, fen: chess.fen() };
  } catch {
    return null;
  }
};

export const isPlayerSolutionStep = (
  startFen: string,
  stepIndex: number,
  playerSide: PlayerSide
): boolean => {
  const playerColor = playerSide === 'white' ? 'w' : 'b';
  return getMoveColorAtPly(startFen, stepIndex) === playerColor;
};

export interface PuzzleStepResult {
  fen: string;
  stepIndex: number;
  solved: boolean;
  autoMoves: string[];
}

export const applyCorrectPlayerMove = (
  startFen: string,
  solutionMoves: string[],
  stepIndex: number,
  from: string,
  to: string,
  playerSide: PlayerSide = 'white'
): PuzzleStepResult | null => {
  if (!isPlayerSolutionStep(startFen, stepIndex, playerSide)) return null;

  const expected = solutionMoves[stepIndex];
  if (!expected) return null;

  const currentFen = getFenAfterMoves(startFen, solutionMoves, stepIndex);
  if (!isExpectedMove(currentFen, from, to, expected)) return null;

  let nextIndex = stepIndex + 1;
  const autoMoves: string[] = [];

  while (nextIndex < solutionMoves.length && !isPlayerSolutionStep(startFen, nextIndex, playerSide)) {
    autoMoves.push(solutionMoves[nextIndex]);
    nextIndex++;
  }

  const fen = getFenAfterMoves(startFen, solutionMoves, nextIndex);

  return {
    fen,
    stepIndex: nextIndex,
    solved: nextIndex >= solutionMoves.length,
    autoMoves,
  };
};

/** @deprecated Use manual boardOrientation state instead */
export const getBoardOrientation = (fen: string): 'white' | 'black' => {
  try {
    return new Chess(fen).turn() === 'w' ? 'white' : 'black';
  } catch {
    return 'white';
  }
};
