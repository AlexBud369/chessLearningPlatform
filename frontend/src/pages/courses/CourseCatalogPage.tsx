import React, { useEffect } from 'react';
import { Header } from '../../widgets/header/Header';
import { Footer } from '../../widgets/footer/Footer';
import { Container, Typography, CircularProgress, Alert, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CourseCard } from '../../shared/ui/CourseCard/CourseCard';
import { CourseFilters } from '../../widgets/courseFilters/CourseFilters';
import { useCourseFilters } from '../../features/course-filters/model/useCourseFilters';
import { useCourses } from '../../features/courses/model/useCourses';

export const CourseCatalogPage: React.FC = () => {
  const { t } = useTranslation();
  const { filters: activeFilters } = useCourseFilters();
  const { courses, loading, error, loadCourses } = useCourses();

  useEffect(() => {
    loadCourses(activeFilters);
  }, [loadCourses, activeFilters]);

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

  return (
    <>
    <Header />
     <Box component="main" sx={{ flexGrow: 1 }}>
      <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('courseCatalog.title')}
      </Typography>
      <CourseFilters />
      {courses.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          {t('courseCatalog.noCourses')}
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {courses.map((course) => (
            <Box key={course.id}>
              <CourseCard course={course} />
            </Box>
          ))}
        </Box>
      )}
    </Container>

     </Box>
    <Footer />
    </>
  );
};