import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import TableViewIcon from '@mui/icons-material/TableView';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  trainerStudentsApi,
  StudentProgressItem,
} from '../../shared/api/trainerStudentsApi';
import { reportsApi } from '../../shared/api/reportsApi';

const formatDate = (value: string | null) => {
  if (!value) return '—';
  return new Date(value).toLocaleString();
};

export const TrainerStudentsProgressTab = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<StudentProgressItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const loadProgress = useCallback(async () => {
    setLoading(true);
    try {
      const response = await trainerStudentsApi.getStudentsProgress();
      setItems(response.data);
    } catch {
      toast.error(t('profile.trainer.progressLoadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      await reportsApi.downloadTrainerPdf();
      toast.success(t('reports.trainerPdfDownloaded'));
    } catch {
      toast.error(t('reports.downloadError'));
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadExcel = async () => {
    setDownloadingExcel(true);
    try {
      await reportsApi.downloadTrainerExcel();
      toast.success(t('reports.trainerExcelDownloaded'));
    } catch {
      toast.error(t('reports.downloadError'));
    } finally {
      setDownloadingExcel(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">{t('profile.trainer.noStudents')}</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ mb: 2 }}
        useFlexGap
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={downloadingPdf ? <CircularProgress size={16} /> : <DownloadIcon />}
          onClick={handleDownloadPdf}
          disabled={downloadingPdf || downloadingExcel}
        >
          {t('reports.downloadTrainerPdf')}
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={downloadingExcel ? <CircularProgress size={16} /> : <TableViewIcon />}
          onClick={handleDownloadExcel}
          disabled={downloadingPdf || downloadingExcel}
        >
          {t('reports.downloadTrainerExcel')}
        </Button>
      </Stack>

      <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('profile.trainer.studentName')}</TableCell>
            <TableCell>{t('profile.trainer.courseProgress')}</TableCell>
            <TableCell align="center">{t('profile.trainer.solvedTasks')}</TableCell>
            <TableCell>{t('profile.trainer.lastActivity')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.student.id}>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {item.student.first_name} {item.student.last_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.student.email}
                </Typography>
              </TableCell>
              <TableCell sx={{ minWidth: 180 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={item.coursesProgressPercent}
                    sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 40 }}>
                    {item.coursesProgressPercent}%
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {t('profile.trainer.coursesCompleted', {
                    completed: item.completedCoursesCount,
                    total: item.assignedCoursesCount,
                  })}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Chip label={item.solvedTasksCount} size="small" color="primary" variant="outlined" />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{formatDate(item.lastActivityAt)}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
    </Box>
  );
};
