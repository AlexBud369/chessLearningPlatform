import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { favoritesApi } from '../../shared/api/favoritesApi';
import { Course } from '../../shared/api/coursesApi';
import { Task } from '../../shared/types/task';
import { CourseCard } from '../../shared/ui/CourseCard/CourseCard';
import { TaskCard } from '../../shared/ui/TaskCard/TaskCard';
import { useFavorites } from '../../features/favorites/model/useFavorites';

export const PlayerFavoritesTab = () => {
  const { t } = useTranslation();
  const { isFavorite: isCourseFavorite, toggleFavorite: toggleCourseFavorite } = useFavorites('course');
  const { isFavorite: isTaskFavorite, toggleFavorite: toggleTaskFavorite } = useFavorites('task');

  const [subTab, setSubTab] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const data = await favoritesApi.getFavoritesDetails();
      setCourses(data.courses);
      setTasks(data.tasks);
    } catch {
      toast.error(t('favorites.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleToggleCourse = async (courseId: number) => {
    await toggleCourseFavorite(courseId);
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const handleToggleTask = async (taskId: number) => {
    await toggleTaskFavorite(taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const activeItems = subTab === 0 ? courses : tasks;
  const emptyKey = subTab === 0 ? 'favorites.emptyCourses' : 'favorites.emptyTasks';

  return (
    <Paper sx={{ p: { xs: 1.5, sm: 3 } }}>
      <Typography variant="h6" gutterBottom>
        {t('favorites.title')}
      </Typography>

      <Tabs
        value={subTab}
        onChange={(_, value) => setSubTab(value)}
        sx={{ mb: 3 }}
        variant="scrollable"
        allowScrollButtonsMobile
      >
        <Tab label={t('favorites.coursesTab', { count: courses.length })} />
        <Tab label={t('favorites.tasksTab', { count: tasks.length })} />
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : activeItems.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
          {t(emptyKey)}
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
            },
          }}
        >
          {subTab === 0
            ? courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isFavorite={isCourseFavorite(course.id)}
                  onToggleFavorite={handleToggleCourse}
                />
              ))
            : tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isFavorite={isTaskFavorite(task.id)}
                  onToggleFavorite={handleToggleTask}
                />
              ))}
        </Box>
      )}
    </Paper>
  );
};
