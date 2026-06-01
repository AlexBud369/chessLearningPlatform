import type { SaveAnalysisRequest } from '../../../shared/api/gamesApi';
import type { ParsedMove } from './usePgnParser';

export type AnalysisSaveNode = SaveAnalysisRequest['nodes'][number];

export const buildAnalysisSavePayload = (
  moves: ParsedMove[],
  comments: Record<string, string>,
  nodeIds: string[]
): AnalysisSaveNode[] =>
  moves.map((move, index) => ({
    fen: move.fen,
    move_from: null,
    move_to: move.san,
    comment: comments[nodeIds[index]] || null,
    is_main: true,
  }));
