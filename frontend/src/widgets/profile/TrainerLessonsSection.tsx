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
import { coursesApi, Course, Lesson } from '../../shared/api/coursesApi';
import { lessonsApi } from '../../shared/api/lessonsApi';

interface LessonForm {
  course_id: number | '';
  title: string;
  content_type: 'video' | 'text';
  content: string;
  order_index: number;
}

const emptyForm: LessonForm = {
  course_id: '',
  title: '',
  content_type: 'text',
  content: '',
  order_index: 0,
};

export const TrainerLessonsSection = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<LessonForm>(emptyForm);

  const loadCourses = useCallback(async () => {
    try {
      const res = await coursesApi.fetchCourses({ page: 1, limit: 100 });
      setCourses(res.courses);
    } catch {
      toast.error(t('trainerContent.loadError'));
    }
  }, [t]);

  const loadLessons = useCallback(async (courseId: number) => {
    setLoading(true);
    try {
      const res = await lessonsApi.getByCourseId(courseId);
      setLessons(res.data);
    } catch {
      toast.error(t('trainerContent.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    if (selectedCourseId) {
      loadLessons(selectedCourseId);
    } else {
      setLessons([]);
    }
  }, [selectedCourseId, loadLessons]);

  const openCreate = () => {
    if (!selectedCourseId) return;
    setEditingId(null);
    setForm({ ...emptyForm, course_id: selectedCourseId, order_index: lessons.length });
    setDialogOpen(true);
  };

  const openEdit = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setForm({
      course_id: lesson.course_id,
      title: lesson.title,
      content_type: lesson.content_type,
      content: lesson.content,
      order_index: lesson.order_index,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim() || !form.course_id) {
      toast.warn(t('trainerContent.fillRequired'));
      return;
    }

    try {
      const payload = {
        course_id: Number(form.course_id),
        title: form.title.trim(),
        content_type: form.content_type,
        content: form.content.trim(),
        order_index: form.order_index,
      };

      if (editingId) {
        await lessonsApi.update(editingId, payload);
        toast.success(t('trainerContent.lessonUpdated'));
      } else {
        await lessonsApi.create(payload);
        toast.success(t('trainerContent.lessonCreated'));
      }

      setDialogOpen(false);
      if (selectedCourseId) await loadLessons(selectedCourseId);
    } catch {
      toast.error(t('trainerContent.saveError'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('trainerContent.confirmDelete'))) return;
    try {
      await lessonsApi.delete(id);
      toast.success(t('trainerContent.deleted'));
      if (selectedCourseId) await loadLessons(selectedCourseId);
    } catch {
      toast.error(t('trainerContent.deleteError'));
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t('trainerContent.lessonsTitle')}
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>{t('assign.course')}</InputLabel>
        <Select
          value={selectedCourseId}
          label={t('assign.course')}
          onChange={(e) => setSelectedCourseId(e.target.value as number | '')}
        >
          <MenuItem value="">{t('trainerContent.selectCourse')}</MenuItem>
          {courses.map((course) => (
            <MenuItem key={course.id} value={course.id}>
              {course.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        startIcon={<AddIcon />}
        variant="contained"
        size="small"
        onClick={openCreate}
        disabled={!selectedCourseId}
        sx={{ mb: 2 }}
      >
        {t('trainerContent.addLesson')}
      </Button>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : selectedCourseId && lessons.length === 0 ? (
        <Typography color="text.secondary">{t('trainerContent.noLessons')}</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>{t('trainerContent.name')}</TableCell>
              <TableCell>{t('trainerContent.contentType')}</TableCell>
              <TableCell align="right">{t('trainerStudents.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lessons.map((lesson) => (
              <TableRow key={lesson.id}>
                <TableCell>{lesson.order_index}</TableCell>
                <TableCell>{lesson.title}</TableCell>
                <TableCell>{lesson.content_type}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEdit(lesson)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(lesson.id)}>
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
          {editingId ? t('trainerContent.editLesson') : t('trainerContent.addLesson')}
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
            <FormControl fullWidth>
              <InputLabel>{t('trainerContent.contentType')}</InputLabel>
              <Select
                value={form.content_type}
                label={t('trainerContent.contentType')}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content_type: e.target.value as 'video' | 'text' }))
                }
              >
                <MenuItem value="text">{t('trainerContent.typeText')}</MenuItem>
                <MenuItem value="video">{t('trainerContent.typeVideo')}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={t('trainerContent.content')}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              multiline
              rows={4}
              required
              fullWidth
            />
            <TextField
              label={t('trainerContent.orderIndex')}
              type="number"
              value={form.order_index}
              onChange={(e) => setForm((f) => ({ ...f, order_index: Number(e.target.value) }))}
              fullWidth
            />
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
