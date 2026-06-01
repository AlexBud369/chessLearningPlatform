import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box,
  Tooltip,
  Stack,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Task } from '../../types/task';
import { getDifficultyColor, getDifficultyLabelKey } from '../../lib/difficulty';

interface TaskCardProps {
  task: Task;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

export const TaskCard = ({
  task,
  isFavorite = false,
  onToggleFavorite,
}: TaskCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const displayTitle = task.title?.trim() || t('tasks.taskNumber', { id: task.id });

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s ease',
        '&:hover': { boxShadow: 6 },
      }}
      onClick={() => navigate(`/tasks/${task.id}`)}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {displayTitle}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontFamily: 'monospace',
            wordBreak: 'break-all',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
            minHeight: 40,
          }}
        >
          {task.fen}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label={t(getDifficultyLabelKey(task.difficulty), { defaultValue: String(task.difficulty) })}
            color={getDifficultyColor(task.difficulty)}
            size="small"
          />
          {task.theme?.name && (
            <Chip label={task.theme.name} variant="outlined" size="small" />
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Tooltip title={isFavorite ? t('favorites.remove') : t('favorites.add')}>
          <IconButton
            size="small"
            color={isFavorite ? 'error' : 'default'}
            onClick={(event) => {
              event.stopPropagation();
              if (onToggleFavorite) {
                onToggleFavorite(task.id);
              }
            }}
          >
            <Box component="span" sx={{ display: 'flex' }}>
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </Box>
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};
