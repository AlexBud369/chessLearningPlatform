import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination as MuiPagination,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useTaskFilters } from '../../features/task-filters/model/useTaskFilters';
import { useFavorites } from '../../features/favorites/model/useFavorites';
import { useAppSelector } from '../../shared/lib/hooks';
import { TaskCard } from '../../shared/ui/TaskCard/TaskCard';
import { tasksApi } from '../../shared/api/tasksApi';
import { Task } from '../../shared/types/task';
import type { CompletionStatus } from '../../shared/api/coursesApi';

export const TasksCatalogPage = () => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.user.user);
  const { search, difficulty, status, page, limit, setSearch, setDifficulty, setStatus, setPage, resetFilters } =
    useTaskFilters();
  const { isFavorite, toggleFavorite } = useFavorites('task');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [difficultyOptions, setDifficultyOptions] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingDifficulties, setLoadingDifficulties] = useState(false);
  const [difficultiesLoaded, setDifficultiesLoaded] = useState(false);

  const loadDifficulties = useCallback(async () => {
    setLoadingDifficulties(true);

    try {
      const res = await tasksApi.getDifficulties();
      const values = Array.isArray(res.data) ? res.data : [];
      setDifficultyOptions(values);
    } catch {
      toast.error(t('tasks.errors.loadDifficulties'));
    } finally {
      setLoadingDifficulties(false);
      setDifficultiesLoaded(true);
    }
  }, [t]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);

    try {
      const res = await tasksApi.getTasks({
        page,
        limit,
        search: search || undefined,
        difficulty: difficulty ? Number(difficulty) : undefined,
        status: status || undefined,
      });

      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error(t('tasks.errors.loadList'));
    } finally {
      setLoading(false);
    }
  }, [difficulty, limit, page, search, status, t]);

  useEffect(() => {
    if (!user && status) {
      setStatus('');
    }
  }, [user, status, setStatus]);

  useEffect(() => {
    loadDifficulties();
  }, [loadDifficulties]);

  useEffect(() => {
    if (!difficultiesLoaded) {
      return;
    }

    if (difficulty && !difficultyOptions.includes(Number(difficulty))) {
      setDifficulty('');
      return;
    }

    fetchTasks();
  }, [difficultiesLoaded, difficulty, difficultyOptions, fetchTasks, setDifficulty]);

  return (
    <Container maxWidth="xl" sx={{ py: 4, flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        {t('tasks.catalog.title')}
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          label={t('tasks.catalog.search')}
          placeholder={t('tasks.catalog.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ flex: 1 }}
        />

        <FormControl size="small" sx={{ minWidth: 220 }} disabled={loadingDifficulties}>
          <InputLabel>{t('tasks.catalog.difficulty')}</InputLabel>
          <Select
            value={difficulty}
            label={t('tasks.catalog.difficulty')}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <MenuItem value="">{t('tasks.difficulty.all')}</MenuItem>
            {difficultyOptions.map((level) => (
              <MenuItem key={level} value={String(level)}>
                {t(`difficulty.level${level}`, { defaultValue: String(level) })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {user && (
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>{t('filters.status')}</InputLabel>
            <Select
              value={status}
              label={t('filters.status')}
              onChange={(e) => setStatus(e.target.value as CompletionStatus | '')}
            >
              <MenuItem value="">{t('filters.allStatuses')}</MenuItem>
              <MenuItem value="completed">{t('filters.completed')}</MenuItem>
              <MenuItem value="not_completed">{t('filters.notCompleted')}</MenuItem>
            </Select>
          </FormControl>
        )}

        <Button variant="outlined" onClick={resetFilters}>
          {t('filters.reset')}
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
          {t('tasks.catalog.empty')}
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
          }}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isFavorite={isFavorite(task.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </Box>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <MuiPagination
            page={page}
            count={totalPages}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};