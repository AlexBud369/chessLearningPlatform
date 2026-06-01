import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Chip, CircularProgress, Alert, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CourseAccordion } from '../../widgets/courseAccordion/CourseAccordion';
import { useCourses } from '../../features/courses/model/useCourses';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs/Breadcrumbs';
import { ROUTES } from '../../shared/constants/routes';

export const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { t } = useTranslation();
  const { currentCourse, loading, error, loadCourseById, clearCurrentCourse } = useCourses();

  useEffect(() => {
    if (!courseId) return;
    loadCourseById(Number(courseId));
    return () => {
      clearCurrentCourse();
    };
  }, [courseId, loadCourseById, clearCurrentCourse]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8, flexGrow: 1 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4, flexGrow: 1 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!currentCourse) {
    return (
      <Container sx={{ py: 4, flexGrow: 1 }}>
        <Alert severity="info">{t('course.notFound')}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4, flexGrow: 1 }}>
      <Breadcrumbs
        items={[
          { label: t('breadcrumbs.home'), path: ROUTES.HOME },
          { label: t('breadcrumbs.courses'), path: ROUTES.COURSES },
          { label: currentCourse.title },
        ]}
      />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {currentCourse.title}
        </Typography>
        {currentCourse.theme && (
          <Chip label={currentCourse.theme.name} size="small" sx={{ mb: 2 }} />
        )}
        <Typography variant="body1" paragraph>
          {currentCourse.description || t('course.noDescription')}
        </Typography>
        {currentCourse.author && (
          <Typography variant="subtitle2" color="textSecondary">
            {t('course.author')}: {currentCourse.author.first_name} {currentCourse.author.last_name}
          </Typography>
        )}
      </Paper>

      <Typography variant="h5" gutterBottom>
        {t('course.lessons')}
      </Typography>
      {currentCourse.lessons && currentCourse.lessons.length > 0 ? (
        <CourseAccordion lessons={currentCourse.lessons} courseId={currentCourse.id} />
      ) : (
        <Alert severity="info">{t('course.noLessons')}</Alert>
      )}
    </Container>
  );
};
