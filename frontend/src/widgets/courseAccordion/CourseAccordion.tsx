import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Lesson } from '../../shared/types/course';
import { useTranslation } from 'react-i18next';

interface CourseAccordionProps {
  lessons: Lesson[];
  courseId: number;
}

export const CourseAccordion: React.FC<CourseAccordionProps> = ({ lessons, courseId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoToLesson = (lessonId: number) => {
    navigate(`/courses/${courseId}/lessons/${lessonId}`);
  };

  const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index);

  return (
    <Box>
      {sortedLessons.map((lesson) => (
        <Accordion key={lesson.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 2 }}>
              <Typography variant="subtitle1">
                {lesson.order_index}. {lesson.title}
              </Typography>
              <Chip
                label={lesson.content_type === 'video' ? t('course.video') : t('course.text')}
                size="small"
                color={lesson.content_type === 'video' ? 'primary' : 'default'}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleGoToLesson(lesson.id)}
              >
                {t('course.goToLesson')}
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};