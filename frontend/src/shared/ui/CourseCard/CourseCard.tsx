import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  LinearProgress,
  Box,
  IconButton,
  CardMedia,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Course } from '../../api/coursesApi';
import { getDifficultyLabelKey } from '../../lib/difficulty';

interface CourseCardProps {
  course: Course;
  progressPercent?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (courseId: number) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  progressPercent, 
  isFavorite = false, 
  onToggleFavorite 
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleOpen = () => {
    navigate(`/courses/${course.id}`);
  };

  const handleToggleFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(course.id);
    }
  };

  const truncatedDescription = course.description && course.description.length > 100
    ? `${course.description.substring(0, 100)}...`
    : course.description;

  const coverImageUrl = course.cover_image 
    ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${course.cover_image}`
    : null;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {coverImageUrl && (
        <CardMedia
          component="img"
          height="140"
          image={coverImageUrl}
          alt={course.title}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="h2" gutterBottom sx={{ pr: 4 }}>
            {course.title}
          </Typography>
          {onToggleFavorite && (
            <IconButton 
              onClick={handleToggleFavorite} 
              size="small" 
              sx={{ position: 'absolute', top: 8, right: 8 }}
              aria-label="toggle favorite"
            >
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          )}
        </Box>
        {course.theme && (
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            {course.theme.name}
          </Typography>
        )}
        {course.difficulty && (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            {t(getDifficultyLabelKey(course.difficulty))}
          </Typography>
        )}
        <Typography variant="body2" color="textSecondary">
          {truncatedDescription || t('courseCard.noDescription')}
        </Typography>
        {progressPercent !== undefined && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="textSecondary">
              {t('courseCard.progressPercent', { percent: progressPercent })}
            </Typography>
            <LinearProgress variant="determinate" value={progressPercent} sx={{ mt: 0.5 }} />
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={handleOpen}>
          {t('courseCard.goToButton')}
        </Button>
      </CardActions>
    </Card>
  );
};