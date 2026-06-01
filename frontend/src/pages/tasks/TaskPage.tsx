import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { tasksApi } from '../../shared/api/tasksApi';
import { Task } from '../../shared/types/task';
import { Chessboard } from '../../shared/ui/Chessboard/Chessboard';
import { BoardControls } from '../../shared/ui/Chessboard/BoardControls';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs/Breadcrumbs';
import { ROUTES } from '../../shared/constants/routes';
import { getDifficultyColor, getDifficultyLabelKey } from '../../shared/lib/difficulty';
import { flipBoardOrientation } from '../../shared/lib/chessFen';
import {
  applyCorrectPlayerMove,
  parseSolutionWithMeta,
} from '../../shared/lib/chessPuzzle';

export const TaskPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [boardFen, setBoardFen] = useState('');
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [solved, setSolved] = useState(false);
  const [lastAutoMoves, setLastAutoMoves] = useState<string[]>([]);

  const { moves: solutionMoves, playerSide, displayLine } = useMemo(
    () => (task ? parseSolutionWithMeta(task.solution, task.fen) : { moves: [], playerSide: 'white' as const, displayLine: '' }),
    [task]
  );

  const fetchTask = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await tasksApi.getTaskById(Number(id));
      setTask(res.data);
      setBoardFen(res.data.fen);
      setStepIndex(0);
      setSolved(false);
      setLastAutoMoves([]);
      setBoardOrientation('white');
    } catch {
      toast.error(t('tasks.errors.loadOne'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handlePieceDrop = (sourceSquare: string, targetSquare: string): boolean => {
    if (!task || solved || solutionMoves.length === 0) {
      return false;
    }

    const result = applyCorrectPlayerMove(
      task.fen,
      solutionMoves,
      stepIndex,
      sourceSquare,
      targetSquare,
      playerSide
    );

    if (!result) {
      toast.error(t('tasks.solve.wrong'));
      return false;
    }

    setLastAutoMoves(result.autoMoves);
    setBoardFen(result.fen);
    setStepIndex(result.stepIndex);

    if (result.solved) {
      setSolved(true);
      void markTaskComplete();
    }

    return true;
  };

  const markTaskComplete = async () => {
    if (!task) return;

    setSaving(true);
    try {
      await tasksApi.completeTask(task.id);
      toast.success(t('tasks.solve.correct'));
    } catch {
      toast.error(t('tasks.errors.solve'));
      setSolved(false);
      handleReset();
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!task) return;
    setBoardFen(task.fen);
    setStepIndex(0);
    setSolved(false);
    setLastAutoMoves([]);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12, flexGrow: 1 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!task) {
    return (
      <Container sx={{ py: 6, flexGrow: 1 }}>
        <Alert severity="error">{t('tasks.errors.notFound')}</Alert>
      </Container>
    );
  }

  const progressLabel = `${Math.min(stepIndex, solutionMoves.length)} / ${solutionMoves.length}`;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3 }, flexGrow: 1 }}>
      <Breadcrumbs
        items={[
          { label: t('breadcrumbs.home'), path: ROUTES.HOME },
          { label: t('breadcrumbs.tasks'), path: ROUTES.TASKS },
          { label: task.title?.trim() || t('tasks.taskNumber', { id: task.id }) },
        ]}
      />
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/tasks')} sx={{ mb: 2 }}>
        {t('tasks.navigation.backToCatalog')}
      </Button>

      <Paper sx={{ p: { xs: 1.5, sm: 3 }, overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            {task.title?.trim() || t('tasks.taskNumber', { id: task.id })}
          </Typography>
          <Chip
            label={t(getDifficultyLabelKey(task.difficulty), { defaultValue: String(task.difficulty) })}
            color={getDifficultyColor(task.difficulty)}
            size="small"
          />
          {task.theme?.name && <Chip label={task.theme.name} variant="outlined" size="small" />}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t('tasks.solve.makeMoveOnBoard')}
        </Typography>

        <Box sx={{ width: '100%', maxWidth: 360, mx: 'auto', mb: 1, overflow: 'hidden' }}>
          <Chessboard
            position={boardFen}
            orientation={boardOrientation}
            arePiecesDraggable={!solved && !saving}
            onPieceDrop={handlePieceDrop}
            compact
            maxWidth={340}
          />
          <BoardControls
            onFlipBoard={() => setBoardOrientation(flipBoardOrientation(boardOrientation))}
            showSwitchTurn={false}
          />
        </Box>

        {displayLine && (
          <Typography
            variant="body2"
            sx={{ fontFamily: 'monospace', mb: 1, textAlign: 'center', color: 'text.secondary' }}
          >
            {displayLine}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
          <Chip label={t('tasks.solve.progress', { current: progressLabel })} size="small" />
          {lastAutoMoves.map((move, index) => (
            <Chip key={`auto-${move}-${index}`} label={`↩ ${move}`} size="small" color="default" variant="outlined" />
          ))}
        </Stack>

        {solved && <Alert severity="success" sx={{ mb: 2 }}>{t('tasks.solve.correct')}</Alert>}

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={handleReset} disabled={saving}>
            {t('tasks.solve.reset')}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};
