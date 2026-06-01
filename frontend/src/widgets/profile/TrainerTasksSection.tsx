import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { tasksApi } from '../../shared/api/tasksApi';
import { themesApi, Theme } from '../../shared/api/themesApi';
import { Task } from '../../shared/types/task';
import { DIFFICULTY_LEVELS } from '../../shared/lib/difficulty';
import { TaskBoardEditor, TaskBoardEditorHandle } from './TaskBoardEditor';
import { hasSolutionMoves, isValidFen } from '../../shared/lib/chessPuzzle';
import { dialogSelectMenuProps } from '../../shared/ui/dialogSelectProps';

interface TaskForm {
  title: string;
  fen: string;
  solution: string;
  difficulty: number;
  theme_id: number | '';
}

const emptyForm: TaskForm = {
  title: '',
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  solution: '',
  difficulty: 1,
  theme_id: '',
};

export const TrainerTasksSection = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<TaskForm>(emptyForm);
  const editorRef = useRef<TaskBoardEditorHandle>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksRes, themesRes] = await Promise.all([
        tasksApi.getTasks({ page: 1, limit: 100 }),
        themesApi.fetchThemes(),
      ]);
      setTasks(tasksRes.data.tasks);
      setThemes(Array.isArray(themesRes) ? themesRes : []);
    } catch {
      toast.error(t('trainerContent.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingId(task.id);
    setForm({
      title: task.title || '',
      fen: task.fen,
      solution: task.solution,
      difficulty: task.difficulty,
      theme_id: task.theme_id,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const snapshot = editorRef.current?.getSnapshot();
    const fen = snapshot?.fen.trim() || form.fen.trim();
    const solution = snapshot?.solution.trim() || form.solution.trim();
    const themeId = Number(form.theme_id);

    if (!themeId || Number.isNaN(themeId)) {
      toast.warn(t('trainerContent.selectTheme'));
      return;
    }
    if (!fen || !isValidFen(fen)) {
      toast.warn(t('tasks.board.invalidFen'));
      return;
    }
    if (!hasSolutionMoves(solution, fen)) {
      toast.warn(t('trainerContent.solutionRequired'));
      return;
    }

    try {
      const payload = {
        title: form.title.trim() || undefined,
        fen,
        solution,
        difficulty: form.difficulty,
        theme_id: themeId,
      };

      if (editingId) {
        await tasksApi.updateTask(editingId, payload);
        toast.success(t('trainerContent.taskUpdated'));
      } else {
        await tasksApi.createTask(payload);
        toast.success(t('trainerContent.taskCreated'));
      }

      setDialogOpen(false);
      await loadData();
    } catch {
      toast.error(t('trainerContent.saveError'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('trainerContent.confirmDelete'))) return;
    try {
      await tasksApi.deleteTask(id);
      toast.success(t('trainerContent.deleted'));
      await loadData();
    } catch {
      toast.error(t('trainerContent.deleteError'));
    }
  };

  return (
    <Paper sx={{ p: { xs: 1, sm: 2 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">{t('trainerContent.tasksTitle')}</Typography>
        <Button startIcon={<AddIcon />} variant="contained" size="small" onClick={openCreate}>
          {t('trainerContent.addTask')}
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{t('trainerContent.name')}</TableCell>
              <TableCell>{t('filters.difficulty')}</TableCell>
              <TableCell>{t('filters.theme')}</TableCell>
              <TableCell align="right">{t('trainerStudents.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.title || `#${task.id}`}</TableCell>
                <TableCell>{t(`difficulty.level${task.difficulty}`)}</TableCell>
                <TableCell>{task.theme?.name ?? task.theme_id}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEdit(task)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(task.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        scroll="paper"
        disableScrollLock
      >
        <DialogTitle sx={{ px: { xs: 1.5, sm: 3 }, py: { xs: 1, sm: 2 } }}>
          {editingId ? t('trainerContent.editTask') : t('trainerContent.addTask')}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            px: { xs: 1, sm: 3 },
            py: { xs: 1, sm: 2 },
            overflow: 'auto',
          }}
        >
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth required sx={{ flex: 1 }}>
                <InputLabel id="task-theme-label">{t('filters.theme')}</InputLabel>
                <Select
                  labelId="task-theme-label"
                  value={form.theme_id}
                  label={t('filters.theme')}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm((f) => ({
                      ...f,
                      theme_id: value === '' ? '' : Number(value),
                    }));
                  }}
                  MenuProps={dialogSelectMenuProps}
                >
                  <MenuItem value="" disabled>
                    {t('trainerContent.selectTheme')}
                  </MenuItem>
                  {themes.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ minWidth: { sm: 140 } }}>
                <InputLabel id="task-difficulty-label">{t('filters.difficulty')}</InputLabel>
                <Select
                  labelId="task-difficulty-label"
                  value={form.difficulty}
                  label={t('filters.difficulty')}
                  onChange={(e) => setForm((f) => ({ ...f, difficulty: Number(e.target.value) }))}
                  MenuProps={dialogSelectMenuProps}
                >
                  {DIFFICULTY_LEVELS.map((level) => (
                    <MenuItem key={level} value={level}>
                      {t(`difficulty.level${level}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <TextField
              label={t('trainerContent.name')}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              fullWidth
              size="small"
            />

            <TaskBoardEditor
              ref={editorRef}
              key={editingId ?? 'new'}
              fen={form.fen}
              solution={form.solution}
              onFenChange={(fen) => setForm((f) => ({ ...f, fen }))}
              onSolutionChange={(solution) => setForm((f) => ({ ...f, solution }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 1.5, sm: 3 }, py: 1, flexWrap: 'wrap', gap: 0.5 }}>
          <Button onClick={() => setDialogOpen(false)}>{t('analysis.cancelComment')}</Button>
          <Button variant="contained" onClick={handleSave}>
            {t('analysis.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
