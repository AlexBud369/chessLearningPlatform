import { useCallback, useEffect, useState } from 'react';
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
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Chess } from 'chess.js';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { tasksApi } from '../../shared/api/tasksApi';
import { SolveTaskResponse, Task } from '../../shared/types/task';
import { Chessboard } from '../../shared/ui/Chessboard/Chessboard';

const difficultyColor = (
  difficulty: string
): 'default' | 'info' | 'success' | 'warning' | 'error' | 'secondary' => {
  if (difficulty === 'beginner') return 'info';
  if (difficulty === 'intermediate') return 'warning';
  if (difficulty === 'advanced') return 'error';
  return 'default';
};

const getHintMove = (solution: string | null): string | null => {
  if (!solution) return null;

  const normalized = solution.replace(/\d+\.(\.\.)?/g, ' ').trim();
  const parts = normalized.split(/[,\s;|]+/).filter(Boolean);
  return parts[0] ?? null;
};

export const TaskPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [move, setMove] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [currentFen, setCurrentFen] = useState('');

  const fetchTask = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await tasksApi.getTaskById(Number(id));
      setTask(res.data);
      setCurrentFen(res.data.fen);
    } catch {
      toast.error(t('tasks.errors.loadOne'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleBoardMove = (sourceSquare: string, targetSquare: string) => {
    if (!task || result === true) {
      return false;
    }

    try {
      const chess = new Chess(task.fen);
      const moveResult = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (!moveResult) {
        return false;
      }

      setMove(moveResult.san);
      setCurrentFen(chess.fen());
      setResult(null);

      return true;
    } catch {
      return false;
    }
  };

  const handleCheck = async () => {
    if (!task || !move.trim()) return;

    setChecking(true);
    try {
      const res = await tasksApi.solveTask(task.id, move.trim());
      const payload: SolveTaskResponse = res.data;

      setResult(payload.correct);

      if (payload.correct) {
        toast.success(t('tasks.solve.correct'));

        try {
          const chess = new Chess(task.fen);
          chess.move(move.trim());
          setCurrentFen(chess.fen());
        } catch {
          setCurrentFen(task.fen);
        }
      } else {
        toast.error(t('tasks.solve.wrong'));
      }
    } catch {
      toast.error(t('tasks.errors.solve'));
    } finally {
      setChecking(false);
    }
  };

  const handleReset = () => {
    if (!task) return;

    setCurrentFen(task.fen);
    setMove('');
    setResult(null);
    setShowHint(false);
  };

  const hintMove = getHintMove(task?.solution ?? null);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!task) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{t('tasks.errors.notFound')}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/tasks')} sx={{ mb: 2 }}>
        {t('tasks.navigation.backToCatalog')}
      </Button>

      <Paper sx={{ p: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            {t('tasks.taskNumber', { id: task.id })}
          </Typography>

          <Chip
            label={t(`tasks.difficulty.${task.difficulty}`, { defaultValue: task.difficulty })}
            color={difficultyColor(task.difficulty)}
            size="small"
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Box sx={{ width: '100%', maxWidth: 560, mx: 'auto' }}>
            <Chessboard
              position={currentFen}
              arePiecesDraggable={result !== true}
              onPieceDrop={(sourceSquare, targetSquare) =>
                handleBoardMove(sourceSquare, targetSquare)
              }
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('tasks.task.initialFen')}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                bgcolor: 'action.hover',
                p: 1.5,
                borderRadius: 1,
                wordBreak: 'break-all',
                mb: 3,
              }}
            >
              {task.fen}
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('tasks.task.currentFen')}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                bgcolor: 'action.hover',
                p: 1.5,
                borderRadius: 1,
                wordBreak: 'break-all',
                mb: 3,
              }}
            >
              {currentFen}
            </Typography>

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {t('tasks.solve.enterMove')}
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                value={move}
                onChange={(e) => setMove(e.target.value)}
                placeholder={t('tasks.solve.movePlaceholder')}
                disabled={result === true}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCheck();
                }}
              />

              <Button
                variant="contained"
                onClick={handleCheck}
                disabled={!move.trim() || checking || result === true}
              >
                {t('tasks.solve.check')}
              </Button>

              <Button variant="outlined" onClick={handleReset}>
                {t('tasks.solve.reset')}
              </Button>
            </Stack>

            {result === true && <Alert severity="success">{t('tasks.solve.correct')}</Alert>}
            {result === false && <Alert severity="error">{t('tasks.solve.wrong')}</Alert>}

            {!showHint && hintMove && result !== true && (
              <Button size="small" onClick={() => setShowHint(true)} sx={{ mt: 2 }}>
                {t('tasks.solve.showHint')}
              </Button>
            )}

            {showHint && hintMove && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {t('tasks.solve.hint')}: <strong>{hintMove}</strong>
              </Alert>
            )}
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};