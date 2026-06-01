const { Chess } = require('chess.js');

const PLAYER_META = /^@player:(white|black)@\s*/i;

const stripSolutionMeta = (solution) => {
  let playerSide = 'white';
  let body = (solution || '').trim();
  const match = body.match(PLAYER_META);
  if (match) {
    playerSide = match[1].toLowerCase();
    body = body.slice(match[0].length).trim();
  }
  return { playerSide, body };
};

const parseSanTokens = (text) => {
  if (!text.trim()) return [];
  const normalized = text.replace(/\d+\.\.\./g, ' ').replace(/\d+\./g, ' ').trim();
  return normalized.split(/[\s,;|]+/).filter(Boolean);
};

const sansFromPgnLine = (startFen, line) => {
  const tokens = parseSanTokens(line);
  if (tokens.length === 0) return [];

  try {
    const chess = new Chess(startFen);
    const sans = [];

    for (const token of tokens) {
      const move = chess.move(token);
      if (!move) break;
      sans.push(move.san);
    }

    return sans;
  } catch {
    return [];
  }
};

const parseSolutionMoves = (solution, startFen) => {
  const { body } = stripSolutionMeta(solution);
  if (!body.trim()) return [];

  if (/\d+\./.test(body)) {
    return sansFromPgnLine(startFen, body);
  }

  return parseSanTokens(body);
};

const boardHasBothKings = (chess) => {
  const board = chess.board();
  let whiteKing = false;
  let blackKing = false;

  for (const row of board) {
    for (const piece of row) {
      if (piece?.type === 'k') {
        if (piece.color === 'w') whiteKing = true;
        if (piece.color === 'b') blackKing = true;
      }
    }
  }

  return { whiteKing, blackKing };
};

const validateTaskFen = (fen) => {
  if (!fen || typeof fen !== 'string' || !fen.trim()) {
    return { ok: false, message: 'FEN is required' };
  }

  try {
    const chess = new Chess(fen.trim());
    const { whiteKing, blackKing } = boardHasBothKings(chess);

    if (!whiteKing) {
      return { ok: false, message: 'Invalid FEN: missing white king' };
    }
    if (!blackKing) {
      return { ok: false, message: 'Invalid FEN: missing black king' };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, message: error.message || 'Invalid FEN' };
  }
};

const validateTaskSolution = (fen, solution) => {
  const fenCheck = validateTaskFen(fen);
  if (!fenCheck.ok) return fenCheck;

  if (!solution || typeof solution !== 'string' || !solution.trim()) {
    return { ok: false, message: 'Solution is required' };
  }

  const moves = parseSolutionMoves(solution, fen.trim());
  if (moves.length === 0) {
    return { ok: false, message: 'Solution has no valid moves for this position' };
  }

  try {
    const chess = new Chess(fen.trim());
    for (const san of moves) {
      let move;
      try {
        move = chess.move(san);
      } catch {
        return { ok: false, message: `Invalid move in solution: ${san}` };
      }
      if (!move) {
        return { ok: false, message: `Invalid move in solution: ${san}` };
      }
    }

    return { ok: true, moves };
  } catch (error) {
    return { ok: false, message: error.message || 'Invalid solution' };
  }
};

const validateTaskPayload = (payload) => {
  if (payload.fen !== undefined) {
    const fenResult = validateTaskFen(payload.fen);
    if (!fenResult.ok) return fenResult;
  }

  if (payload.fen !== undefined && payload.solution !== undefined) {
    return validateTaskSolution(payload.fen, payload.solution);
  }

  return { ok: true };
};

module.exports = {
  validateTaskFen,
  validateTaskSolution,
  validateTaskPayload,
  parseSolutionMoves,
};
