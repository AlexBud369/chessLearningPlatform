import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, forwardRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Chessboard } from '../../shared/ui/Chessboard/Chessboard';
import { BoardControls } from '../../shared/ui/Chessboard/BoardControls';
import { flipBoardOrientation } from '../../shared/lib/chessFen';
import { formatSanListAsPgnLine } from '../../shared/lib/formatMoveNotation';
import {
  formatSolutionWithMeta,
  getFenAfterMoves,
  validateTaskFen,
  parseSolutionWithMeta,
  PlayerSide,
  tryMoveFromSquares,
} from '../../shared/lib/chessPuzzle';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

interface TaskBoardEditorProps {
  fen: string;
  solution: string;
  onFenChange: (fen: string) => void;
  onSolutionChange: (solution: string) => void;
}

export interface TaskBoardEditorSnapshot {
  fen: string;
  solution: string;
}

export interface TaskBoardEditorHandle {
  getSnapshot: () => TaskBoardEditorSnapshot;
}

export const TaskBoardEditor = forwardRef<TaskBoardEditorHandle, TaskBoardEditorProps>(({
  fen,
  solution,
  onFenChange,
  onSolutionChange,
}, ref) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState(0);
  const [baseFen, setBaseFen] = useState(fen || START_FEN);
  const [positionFen, setPositionFen] = useState(fen || START_FEN);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [playerSide, setPlayerSide] = useState<PlayerSide>('white');
  const [solutionMoves, setSolutionMoves] = useState<string[]>([]);
  const [solutionFen, setSolutionFen] = useState(fen || START_FEN);
  const lastSyncedSolution = useRef(solution);
  const lastFen = useRef(fen);

  const initFromProps = useCallback((nextFen: string, nextSolution: string) => {
    const base = nextFen || START_FEN;
    const parsed = parseSolutionWithMeta(nextSolution, base);
    setBaseFen(base);
    setPositionFen(base);
    setSolutionMoves(parsed.moves);
    setPlayerSide(parsed.playerSide);
    setSolutionFen(getFenAfterMoves(base, parsed.moves, parsed.moves.length));
    lastSyncedSolution.current = nextSolution;
  }, []);

  useEffect(() => {
    const fenChanged = fen !== lastFen.current;
    const solutionExternal = solution !== lastSyncedSolution.current;
    if (!fenChanged && !solutionExternal) return;
    lastFen.current = fen;
    initFromProps(fen, solution);
  }, [fen, solution, initFromProps]);

  const syncSolutionToParent = useCallback(
    (moves: string[], side: PlayerSide, startFen: string) => {
      const next = formatSolutionWithMeta(moves, startFen, side);
      lastSyncedSolution.current = next;
      onSolutionChange(next);
    },
    [onSolutionChange]
  );

  const notationLine = useMemo(
    () => formatSanListAsPgnLine(baseFen, solutionMoves),
    [baseFen, solutionMoves]
  );

  const handlePositionDrop = (from: string, to: string): boolean => {
    const result = tryMoveFromSquares(positionFen, from, to);
    if (!result) {
      toast.error(t('tasks.board.illegalMove'));
      return false;
    }
    setPositionFen(result.fen);
    return true;
  };

  const applyStartPosition = () => {
    const fenValidation = validateTaskFen(positionFen);
    if (!fenValidation.ok) {
      toast.error(fenValidation.message || t('tasks.board.invalidFen'));
      return;
    }
    setBaseFen(positionFen);
    setSolutionFen(positionFen);
    setSolutionMoves([]);
    onFenChange(positionFen);
    syncSolutionToParent([], playerSide, positionFen);
    toast.success(t('tasks.board.startPositionSet'));
  };

  const handleModeChange = (_: unknown, nextMode: number) => {
    if (nextMode === 1) {
      const recordingBase = validateTaskFen(positionFen).ok ? positionFen : baseFen;
      setBaseFen(recordingBase);
      setSolutionFen(getFenAfterMoves(recordingBase, solutionMoves, solutionMoves.length));
    }
    setMode(nextMode);
  };

  const handleSolutionDrop = (from: string, to: string): boolean => {
    const result = tryMoveFromSquares(solutionFen, from, to);
    if (!result) {
      toast.error(t('tasks.board.illegalMove'));
      return false;
    }

    const nextMoves = [...solutionMoves, result.san];
    setSolutionMoves(nextMoves);
    setSolutionFen(result.fen);
    syncSolutionToParent(nextMoves, playerSide, baseFen);
    return true;
  };

  const undoSolutionMove = () => {
    if (solutionMoves.length === 0) return;
    const nextMoves = solutionMoves.slice(0, -1);
    setSolutionMoves(nextMoves);
    setSolutionFen(getFenAfterMoves(baseFen, nextMoves, nextMoves.length));
    syncSolutionToParent(nextMoves, playerSide, baseFen);
  };

  const resetSolutionRecording = () => {
    setSolutionMoves([]);
    setSolutionFen(baseFen);
    syncSolutionToParent([], playerSide, baseFen);
  };

  const handlePlayerSideChange = (side: PlayerSide) => {
    setPlayerSide(side);
    syncSolutionToParent(solutionMoves, side, baseFen);
  };

  useImperativeHandle(
    ref,
    () => ({
      getSnapshot: () => {
        const effectiveFen = validateTaskFen(positionFen).ok ? positionFen : baseFen;
        return {
          fen: effectiveFen,
          solution: formatSolutionWithMeta(solutionMoves, effectiveFen, playerSide),
        };
      },
    }),
    [baseFen, positionFen, playerSide, solutionMoves]
  );

  return (
    <Box>
      <Tabs value={mode} onChange={handleModeChange} sx={{ mb: 2 }} variant="fullWidth">
        <Tab label={t('tasks.board.tabPosition')} />
        <Tab label={t('tasks.board.tabSolution')} />
      </Tabs>

      {mode === 0 ? (
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {t('tasks.board.positionHint')}
          </Typography>
          <Chessboard
            position={positionFen}
            orientation={boardOrientation}
            arePiecesDraggable
            onPieceDrop={handlePositionDrop}
            compact
            maxWidth={340}
          />
          <BoardControls
            onFlipBoard={() => setBoardOrientation(flipBoardOrientation(boardOrientation))}
            showSwitchTurn={false}
          />
          <TextField
            label="FEN"
            value={positionFen}
            onChange={(e) => setPositionFen(e.target.value)}
            multiline
            size="small"
            fullWidth
          />
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button variant="outlined" size="small" onClick={() => setPositionFen(START_FEN)}>
              {t('tasks.board.resetStandard')}
            </Button>
            <Button variant="contained" size="small" onClick={applyStartPosition}>
              {t('tasks.board.setStartPosition')}
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {t('tasks.board.solutionHint')}
          </Typography>
          <Chessboard
            position={solutionFen}
            orientation={boardOrientation}
            arePiecesDraggable
            onPieceDrop={handleSolutionDrop}
            compact
            maxWidth={340}
          />
          <BoardControls
            onFlipBoard={() => setBoardOrientation(flipBoardOrientation(boardOrientation))}
            showSwitchTurn={false}
          />
          <FormControl fullWidth size="small">
            <InputLabel>{t('tasks.board.playerSide')}</InputLabel>
            <Select
              value={playerSide}
              label={t('tasks.board.playerSide')}
              onChange={(e) => handlePlayerSideChange(e.target.value as PlayerSide)}
            >
              <MenuItem value="white">{t('analysis.white')}</MenuItem>
              <MenuItem value="black">{t('analysis.black')}</MenuItem>
            </Select>
          </FormControl>
          <Box
            sx={{
              bgcolor: 'action.hover',
              p: 1,
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              minHeight: 40,
            }}
          >
            {notationLine || t('tasks.board.noSolutionYet')}
          </Box>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small" onClick={undoSolutionMove} disabled={!solutionMoves.length}>
              {t('tasks.board.undoMove')}
            </Button>
            <Button variant="outlined" size="small" onClick={resetSolutionRecording}>
              {t('tasks.board.clearSolution')}
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
});

TaskBoardEditor.displayName = 'TaskBoardEditor';
