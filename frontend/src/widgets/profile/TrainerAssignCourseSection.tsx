import { useCallback, useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { trainerStudentsApi, TrainerStudentRelation } from '../../shared/api/trainerStudentsApi';
import { assignedCoursesApi, TrainerAssignment } from '../../shared/api/assignedCoursesApi';
import { coursesApi } from '../../shared/api/coursesApi';

interface CourseOption {
  id: number;
  title: string;
}

export const TrainerAssignCourseSection = () => {
  const { t } = useTranslation();

  const [students, setStudents] = useState<TrainerStudentRelation[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [assignments, setAssignments] = useState<TrainerAssignment[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<CourseOption[]>([]);

  const loadStudents = useCallback(async () => {
    setLoadingStudents(true);
    try {
      const response = await trainerStudentsApi.getMyStudents();
      setStudents(response.data);
    } catch {
      toast.error(t('assign.loadStudentsError'));
    } finally {
      setLoadingStudents(false);
    }
  }, [t]);

  const loadCourses = useCallback(async () => {
    setLoadingCourses(true);
    try {
      const response = await coursesApi.fetchCourses({ page: 1, limit: 100 });
      setCourses(response.courses.map((c) => ({ id: c.id, title: c.title })));
    } catch {
      toast.error(t('assign.loadCoursesError'));
    } finally {
      setLoadingCourses(false);
    }
  }, [t]);

  const loadAssignments = useCallback(async () => {
    setLoadingAssignments(true);
    try {
      const response = await assignedCoursesApi.getTrainerAssignments();
      setAssignments(response.data);
    } catch {
      toast.error(t('assign.loadAssignmentsError'));
    } finally {
      setLoadingAssignments(false);
    }
  }, [t]);

  useEffect(() => {
    loadStudents();
    loadCourses();
    loadAssignments();
  }, [loadStudents, loadCourses, loadAssignments]);

  const selectedStudent = students.find((s) => s.student.id === selectedStudentId)?.student;

  const assignedCourseIdsForSelectedStudent = new Set(
    assignments
      .filter((a) => a.student_id === selectedStudentId)
      .map((a) => a.course_id)
  );

  const isCourseAssignedToSelectedStudent = (courseId: number) =>
    assignedCourseIdsForSelectedStudent.has(courseId);

  const handleAssign = async () => {
    if (!selectedStudentId || selectedCourses.length === 0) return;

    const coursesToAssign = selectedCourses.filter((c) => !isCourseAssignedToSelectedStudent(c.id));
    const skippedCount = selectedCourses.length - coursesToAssign.length;

    if (coursesToAssign.length === 0) {
      toast.warn(t('assign.alreadyAssigned'));
      return;
    }

    setAssigning(true);
    try {
      if (coursesToAssign.length === 1) {
        await assignedCoursesApi.assignCourse(selectedStudentId, coursesToAssign[0].id);
      } else {
        await assignedCoursesApi.assignCoursesBulk(
          selectedStudentId,
          coursesToAssign.map((c) => c.id)
        );
      }
      toast.success(t('assign.success'));
      if (skippedCount > 0) {
        toast.info(t('assign.skippedAlreadyAssigned', { count: skippedCount }));
      }
      setSelectedCourses([]);
      await loadAssignments();
    } catch {
      toast.error(t('assign.error'));
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveAssignment = async (studentId: number, courseId: number) => {
    try {
      await assignedCoursesApi.removeAssignment(studentId, courseId);
      toast.success(t('assign.removed'));
      setAssignments((prev) =>
        prev.filter((a) => !(a.student_id === studentId && a.course_id === courseId))
      );
    } catch {
      toast.error(t('assign.removeError'));
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t('profile.trainer.assignCourse')}
      </Typography>

      {loadingStudents ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : students.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {t('profile.trainer.noStudents')}
        </Typography>
      ) : (
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Autocomplete
            options={students.map((r) => r.student)}
            getOptionLabel={(s) => `${s.first_name} ${s.last_name} (${s.email})`}
            value={selectedStudent ?? null}
            onChange={(_, value) => setSelectedStudentId(value?.id ?? null)}
            renderInput={(params) => (
              <TextField {...params} label={t('assign.student')} />
            )}
          />

          <Autocomplete
            multiple
            options={courses}
            getOptionLabel={(c) => c.title}
            getOptionDisabled={(c) =>
              selectedStudentId != null && isCourseAssignedToSelectedStudent(c.id)
            }
            value={selectedCourses}
            onChange={(_, value) => setSelectedCourses(value)}
            loading={loadingCourses}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option.id} label={option.title} size="small" />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label={t('assign.course')} placeholder={t('assign.selectCourses')} />
            )}
          />

          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleAssign}
            disabled={!selectedStudentId || selectedCourses.length === 0 || assigning}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('assign.assignButton')}
          </Button>
        </Stack>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" gutterBottom>
        {t('assign.currentAssignments')}
      </Typography>

      {loadingAssignments ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : assignments.length === 0 ? (
        <Typography color="text.secondary">{t('assign.noAssignments')}</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('assign.student')}</TableCell>
              <TableCell>{t('assign.course')}</TableCell>
              <TableCell>{t('assign.assignedAt')}</TableCell>
              <TableCell align="right">{t('trainerStudents.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>
                  {assignment.student
                    ? `${assignment.student.first_name} ${assignment.student.last_name}`
                    : `#${assignment.student_id}`}
                </TableCell>
                <TableCell>{assignment.course?.title ?? `#${assignment.course_id}`}</TableCell>
                <TableCell>
                  {new Date(assignment.assigned_at).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() =>
                      handleRemoveAssignment(assignment.student_id, assignment.course_id)
                    }
                    aria-label={t('assign.removeAssignment')}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};
