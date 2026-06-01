import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { gamesApi, Game } from '../../shared/api/gamesApi';

export const PlayerGamesTab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pgn, setPgn] = useState('');
  const [title, setTitle] = useState('');
  const [studentNote, setStudentNote] = useState('');
  const [shareWithTrainer, setShareWithTrainer] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadGames = useCallback(async () => {
    setLoading(true);
    try {
      const res = await gamesApi.getUserGames({ page: 1, limit: 50 });
      setGames(res.data.games);
    } catch {
      toast.error(t('games.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  const handleUpload = async () => {
    if (!pgn.trim()) {
      toast.warn(t('games.pgnRequired'));
      return;
    }

    setUploading(true);
    try {
      await gamesApi.uploadPgn({
        pgn: pgn.trim(),
        title: title.trim() || undefined,
        student_note: studentNote.trim() || undefined,
        shared_with_trainer: shareWithTrainer,
      });
      toast.success(t('games.uploaded'));
      setDialogOpen(false);
      setPgn('');
      setTitle('');
      setStudentNote('');
      await loadGames();
    } catch {
      toast.error(t('games.uploadError'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('games.confirmDelete'))) return;
    try {
      await gamesApi.deleteGame(id);
      toast.success(t('games.deleted'));
      await loadGames();
    } catch {
      toast.error(t('games.deleteError'));
    }
  };

  const hasTrainerReply = (game: Game) =>
    game.last_edited_by != null && game.last_edited_by !== game.user_id;

  return (
    <Paper sx={{ p: { xs: 1, sm: 2 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">{t('games.myGames')}</Typography>
        <Button startIcon={<AddIcon />} variant="contained" size="small" onClick={() => setDialogOpen(true)}>
          {t('games.upload')}
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : games.length === 0 ? (
        <Typography color="text.secondary">{t('games.empty')}</Typography>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('games.titleCol')}</TableCell>
                <TableCell>{t('games.dateCol')}</TableCell>
                <TableCell>{t('games.sharedCol')}</TableCell>
                <TableCell>{t('games.statusCol')}</TableCell>
                <TableCell align="right">{t('trainerStudents.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>{game.title || `#${game.id}`}</TableCell>
                  <TableCell>
                    {game.date_played
                      ? new Date(game.date_played).toLocaleDateString()
                      : new Date(game.uploaded_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{game.shared_with_trainer ? t('games.yes') : t('games.no')}</TableCell>
                  <TableCell>{hasTrainerReply(game) ? t('games.trainerReplied') : '—'}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/analysis/${game.id}`)}
                      aria-label={t('games.openAnalysis')}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(game.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t('games.upload')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={t('games.titleCol')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="PGN"
              value={pgn}
              onChange={(e) => setPgn(e.target.value)}
              multiline
              minRows={6}
              fullWidth
              required
            />
            <TextField
              label={t('games.studentNote')}
              value={studentNote}
              onChange={(e) => setStudentNote(e.target.value)}
              multiline
              minRows={2}
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={shareWithTrainer}
                  onChange={(e) => setShareWithTrainer(e.target.checked)}
                />
              }
              label={t('games.shareWithTrainer')}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('analysis.cancelComment')}</Button>
          <Button variant="contained" onClick={handleUpload} disabled={uploading}>
            {t('games.upload')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
