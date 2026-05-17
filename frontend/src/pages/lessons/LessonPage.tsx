import React, { useEffect, useState } from 'react';
import { Header } from '../../widgets/header/Header';
import { Footer } from '../../widgets/footer/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, CircularProgress, Alert } from '@mui/material';
import { useLessonProgress } from '../../features/lesson-progress/model/useLessonProgress';
import { useTranslation } from 'react-i18next';
import { useCourses } from '../../features/courses/model/useCourses';

export const LessonPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { markLessonCompleted, loading: progressLoading } = useLessonProgress();
  const { currentCourse, loading, error, loadCourseById } = useCourses();
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    loadCourseById(Number(courseId));
  }, [courseId, loadCourseById]);

  const lesson = currentCourse?.lessons?.find((l) => l.id === Number(lessonId));
  const lessons = currentCourse?.lessons || [];
  const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index);
  const currentIndex = sortedLessons.findIndex((l) => l.id === Number(lessonId));
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null;

  const handleMarkCompleted = async () => {
    if (!lessonId) return;
    await markLessonCompleted(Number(lessonId), () => {
      setCompleted(true);
    });
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!lesson) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">{t('lesson.notFound')}</Alert>
      </Container>
    );
  }

  return (
    <>
    <Header />
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {lesson.title}
        </Typography>
        <Box sx={{ mb: 3 }}>
          {lesson.content_type === 'video' ? (
            <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={lesson.content}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                frameBorder="0"
                allowFullScreen
                title={lesson.title}
              />
            </Box>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="outlined"
            disabled={!prevLesson}
            onClick={() => prevLesson && navigate(`/courses/${courseId}/lessons/${prevLesson.id}`)}
          >
            {t('lesson.previous')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleMarkCompleted}
            disabled={progressLoading || completed}
          >
            {completed ? t('lesson.completed') : t('lesson.markCompleted')}
          </Button>
          <Button
            variant="outlined"
            disabled={!nextLesson}
            onClick={() => nextLesson && navigate(`/courses/${courseId}/lessons/${nextLesson.id}`)}
          >
            {t('lesson.next')}
          </Button>
        </Box>
      </Paper>
    </Container>
     <Footer />
    </>
    
  );
};