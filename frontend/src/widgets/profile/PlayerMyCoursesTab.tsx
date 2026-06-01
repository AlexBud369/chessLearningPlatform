import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAssignCourse } from '../../features/assign-course/model/useAssignCourse';

export const PlayerMyCoursesTab = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { myCourses, myCoursesTotalPages, loadingMyCourses, loadMyCourses } = useAssignCourse();
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    loadMyCourses(page, limit);
  }, [page, loadMyCourses]);

  if (loadingMyCourses) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (myCourses.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
        {t('myCourses.empty')}
      </Typography>
    );
  }

  return (
    <>
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
        {myCourses.map((assignment) => (
          <Card key={assignment.id} sx={{ height: '100%' }}>
            <CardActionArea
              onClick={() => assignment.course && navigate(`/courses/${assignment.course.id}`)}
            >
              {assignment.course?.cover_image && (
                <CardMedia
                  component="img"
                  height="140"
                  image={assignment.course.cover_image}
                  alt={assignment.course.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {assignment.course?.title || t('myCourses.unknownCourse')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {assignment.course?.description || '—'}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {assignment.assigner?.username && (
                    <Chip
                      label={`${t('myCourses.assignedBy')}: ${assignment.assigner.username}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  <Chip
                    label={new Date(assignment.assigned_at).toLocaleDateString()}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {myCoursesTotalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            page={page}
            count={myCoursesTotalPages}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </>
  );
};
