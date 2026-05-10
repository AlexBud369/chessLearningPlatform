import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  LinearProgress,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../../api/coursesApi';

interface CourseCardProps {
  course: Course;
  progressPercent?: number; 
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, progressPercent }) => {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/courses/${course.id}`);
  };

  const truncatedDescription = course.description && course.description.length > 100
    ? `${course.description.substring(0, 100)}...`
    : course.description;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {course.title}
        </Typography>
        {course.theme && (
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            {course.theme.name}
          </Typography>
        )}
        <Typography variant="body2" color="textSecondary">
          {truncatedDescription || 'Нет описания'}
        </Typography>
        {progressPercent !== undefined && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="textSecondary">
              Прогресс: {progressPercent}%
            </Typography>
            <LinearProgress variant="determinate" value={progressPercent} sx={{ mt: 0.5 }} />
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={handleOpen}>
          Перейти
        </Button>
      </CardActions>
    </Card>
  );
};