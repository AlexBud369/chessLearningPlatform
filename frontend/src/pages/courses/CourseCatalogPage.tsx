import React, { useEffect } from 'react';
import { Container, Typography, CircularProgress, Alert, Box, LinearProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CourseCard } from '../../shared/ui/CourseCard/CourseCard';
import { CourseFilters } from '../../widgets/courseFilters/CourseFilters';
import { useCourseFilters } from '../../features/course-filters/model/useCourseFilters';
import { useCourses } from '../../features/courses/model/useCourses';
import { useFavorites } from '../../features/favorites/model/useFavorites';
import { Pagination } from '../../shared/ui/Pagination/Pagination';

export const CourseCatalogPage: React.FC = () => {
  const { t } = useTranslation();
  const { filters: activeFilters, setPage } = useCourseFilters();
  const { courses, loading, error, loadCourses, totalPages, page } = useCourses();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    loadCourses(activeFilters);
  }, [loadCourses, activeFilters]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Container sx={{ py: 4, flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        {t('courseCatalog.title')}
      </Typography>
      <CourseFilters />
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {loading && courses.length === 0 && !error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : courses.length === 0 && !loading ? (
        <Typography variant="body1" color="textSecondary">
          {t('courseCatalog.noCourses')}
        </Typography>
      ) : courses.length > 0 ? (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
              mb: 4,
              opacity: loading ? 0.65 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {courses.map((course) => (
              <Box key={course.id}>
                <CourseCard
                  course={course}
                  isFavorite={isFavorite(course.id)}
                  onToggleFavorite={toggleFavorite}
                />
              </Box>
            ))}
          </Box>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination count={totalPages} page={page} onChange={handlePageChange} />
            </Box>
          )}
        </>
      ) : null}
    </Container>
  );
};
