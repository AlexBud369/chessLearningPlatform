import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { trainerStudentsApi } from '../../shared/api/trainerStudentsApi';
import { Game } from '../../shared/api/gamesApi';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs/Breadcrumbs';
import { ROUTES } from '../../shared/constants/routes';

export const TrainerStudentGamesPage = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGames = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    try {
      const res = await trainerStudentsApi.getStudentGames(Number(studentId), { page: 1, limit: 50 });
      setGames(res.data.games);
    } catch {
      toast.error(t('games.loadError'));
    } finally {
      setLoading(false);
    }
  }, [studentId, t]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3 }, flexGrow: 1 }}>
      <Breadcrumbs
        items={[
          { label: t('breadcrumbs.home'), path: ROUTES.HOME },
          { label: t('profile.title'), path: ROUTES.PROFILE },
          { label: t('games.studentGamesTitle', { id: studentId }) },
        ]}
      />

      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(ROUTES.PROFILE)} sx={{ mb: 2 }}>
        {t('analysis.back')}
      </Button>

      <Paper sx={{ p: { xs: 1, sm: 2 } }}>
        <Typography variant="h6" gutterBottom>
          {t('games.studentGamesTitle', { id: studentId })}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('games.studentGamesHint')}
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : games.length === 0 ? (
          <Typography color="text.secondary">{t('games.studentGamesEmpty')}</Typography>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('games.titleCol')}</TableCell>
                  <TableCell>{t('games.dateCol')}</TableCell>
                  <TableCell>{t('games.studentNote')}</TableCell>
                  <TableCell align="right">{t('trainerStudents.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {games.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>{game.title || `#${game.id}`}</TableCell>
                    <TableCell>
                      {game.updated_at ? new Date(game.updated_at).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {game.student_note || '—'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/analysis/${game.id}`)}
                        aria-label={t('games.openAnalysis')}
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>
    </Container>
  );
};
