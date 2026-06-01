import { useCallback, useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { trainerStudentsApi, TrainerStudentRelation } from '../../shared/api/trainerStudentsApi';

type PlayerOption = TrainerStudentRelation['student'];

export const TrainerStudentsManageSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [students, setStudents] = useState<TrainerStudentRelation[]>([]);
  const [searchResults, setSearchResults] = useState<PlayerOption[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerOption | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await trainerStudentsApi.getMyStudents();
      setStudents(response.data);
    } catch {
      toast.error(t('trainerStudents.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await trainerStudentsApi.searchPlayers(query);
      const existingIds = new Set(students.map((s) => s.student.id));
      setSearchResults(response.data.filter((p) => !existingIds.has(p.id)));
    } catch {
      toast.error(t('trainerStudents.searchError'));
    } finally {
      setSearching(false);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedPlayer) return;

    setAdding(true);
    try {
      await trainerStudentsApi.addStudent(selectedPlayer.id);
      toast.success(t('trainerStudents.added'));
      setSelectedPlayer(null);
      setSearchQuery('');
      setSearchResults([]);
      await loadStudents();
    } catch {
      toast.error(t('trainerStudents.addError'));
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    try {
      await trainerStudentsApi.removeStudent(studentId);
      toast.success(t('trainerStudents.removed'));
      setStudents((prev) => prev.filter((s) => s.student.id !== studentId));
    } catch {
      toast.error(t('trainerStudents.removeError'));
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t('trainerStudents.title')}
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Autocomplete
          sx={{ flex: 1 }}
          options={searchResults}
          getOptionLabel={(p) => `${p.first_name} ${p.last_name} (${p.email})`}
          value={selectedPlayer}
          onChange={(_, value) => setSelectedPlayer(value)}
          inputValue={searchQuery}
          onInputChange={(_, value) => handleSearch(value)}
          loading={searching}
          noOptionsText={searchQuery.length < 2 ? t('trainerStudents.searchHint') : t('trainerStudents.noResults')}
          renderInput={(params) => (
            <TextField {...params} label={t('trainerStudents.searchPlayer')} />
          )}
        />
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleAddStudent}
          disabled={!selectedPlayer || adding}
          sx={{ flexShrink: 0 }}
        >
          {t('trainerStudents.addButton')}
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : students.length === 0 ? (
        <Typography color="text.secondary">{t('trainerStudents.empty')}</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('trainerStudents.name')}</TableCell>
              <TableCell>{t('trainerStudents.email')}</TableCell>
              <TableCell align="right">{t('trainerStudents.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((relation) => (
              <TableRow key={relation.id}>
                <TableCell>
                  {relation.student.first_name} {relation.student.last_name}
                </TableCell>
                <TableCell>{relation.student.email}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/trainer/students/${relation.student.id}/games`)}
                    aria-label={t('games.studentGames')}
                  >
                    <SportsEsportsIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveStudent(relation.student.id)}
                    aria-label={t('trainerStudents.removeButton')}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};
