import { useCallback, useEffect, useState } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { coursesApi, Course } from '../../shared/api/coursesApi';
import { themesApi, Theme } from '../../shared/api/themesApi';
import { DIFFICULTY_LEVELS } from '../../shared/lib/difficulty';

interface CourseForm {
  title: string;
  description: string;
  theme_id: number | '';
  difficulty: number;
}

const emptyForm: CourseForm = { title: '', description: '', theme_id: '', difficulty: 1 };

export const TrainerCoursesSection = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [coursesRes, themesRes] = await Promise.all([
        coursesApi.fetchCourses({ page: 1, limit: 100 }),
        themesApi.fetchThemes(),
      ]);
      setCourses(coursesRes.courses);
      setThemes(themesRes);
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

  const openEdit = (course: Course) => {
    setEditingId(course.id);
    setForm({
      title: course.title,
      description: course.description || '',
      theme_id: course.theme_id,
      difficulty: course.difficulty || 1,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.theme_id) {
      toast.warn(t('trainerContent.fillRequired'));
      return;
    }

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        theme_id: Number(form.theme_id),
        difficulty: form.difficulty,
      };

      if (editingId) {
        await coursesApi.updateCourse(editingId, payload);
        toast.success(t('trainerContent.courseUpdated'));
      } else {
        await coursesApi.createCourse(payload);
        toast.success(t('trainerContent.courseCreated'));
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
      await coursesApi.deleteCourse(id);
      toast.success(t('trainerContent.deleted'));
      await loadData();
    } catch {
      toast.error(t('trainerContent.deleteError'));
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">{t('trainerContent.coursesTitle')}</Typography>
        <Button startIcon={<AddIcon />} variant="contained" size="small" onClick={openCreate}>
          {t('trainerContent.addCourse')}
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
              <TableCell>{t('trainerContent.name')}</TableCell>
              <TableCell>{t('filters.theme')}</TableCell>
              <TableCell>{t('filters.difficulty')}</TableCell>
              <TableCell align="right">{t('trainerStudents.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.theme?.name ?? course.theme_id}</TableCell>
                <TableCell>{t(`difficulty.level${course.difficulty || 1}`)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEdit(course)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(course.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingId ? t('trainerContent.editCourse') : t('trainerContent.addCourse')}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={t('trainerContent.name')}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label={t('trainerContent.description')}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              multiline
              rows={3}
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>{t('filters.theme')}</InputLabel>
              <Select
                value={form.theme_id}
                label={t('filters.theme')}
                onChange={(e) => setForm((f) => ({ ...f, theme_id: e.target.value as number }))}
              >
                {themes.map((theme) => (
                  <MenuItem key={theme.id} value={theme.id}>
                    {theme.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t('filters.difficulty')}</InputLabel>
              <Select
                value={form.difficulty}
                label={t('filters.difficulty')}
                onChange={(e) => setForm((f) => ({ ...f, difficulty: Number(e.target.value) }))}
              >
                {DIFFICULTY_LEVELS.map((level) => (
                  <MenuItem key={level} value={level}>
                    {t(`difficulty.level${level}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('analysis.cancelComment')}</Button>
          <Button variant="contained" onClick={handleSave}>
            {t('analysis.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
