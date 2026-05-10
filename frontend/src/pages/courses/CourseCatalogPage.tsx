import React, { useEffect } from 'react';
import { Container, Typography, CircularProgress, Alert, Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../shared/lib/hooks';
import { fetchCourses } from '../../entities/course/model/store';
import { CourseCard } from '../../shared/ui/CourseCard/CourseCard';
import { CourseFilters } from '../../widgets/courseFilters/CourseFilters';
import { useCourseFilters } from '../../features/course-filters/model/useCourseFilters';

export const CourseCatalogPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { courses, loading, error } = useAppSelector((state) => state.courses);
  const { filters: activeFilters } = useCourseFilters();

  useEffect(() => {
    dispatch(fetchCourses(activeFilters));
  }, [dispatch, activeFilters]);

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
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Каталог курсов
      </Typography>
      <CourseFilters />
      {courses.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          Курсы не найдены. Попробуйте изменить фильтры.
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
  );
};