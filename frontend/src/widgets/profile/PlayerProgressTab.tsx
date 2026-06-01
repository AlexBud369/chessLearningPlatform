import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { progressApi, TaskChartPoint } from '../../shared/api/progressApi';
import { reportsApi } from '../../shared/api/reportsApi';

const PERIOD_OPTIONS = [7, 30, 90] as const;

const getTickInterval = (isMobile: boolean, days: number): number | 'preserveStartEnd' => {
  if (days === 7) return isMobile ? 0 : 0;
  if (days === 30) return isMobile ? 5 : 2;
  return isMobile ? 13 : 6;
};

export const PlayerProgressTab = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [days, setDays] = useState<number>(30);
  const [timeline, setTimeline] = useState<TaskChartPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const loadChart = useCallback(async () => {
    setLoading(true);
    try {
      const data = await progressApi.getTaskChart(days);
      setTimeline(data.timeline);
    } catch {
      toast.error(t('profile.progress.loadError'));
    } finally {
      setLoading(false);
    }
  }, [days, t]);

  useEffect(() => {
    loadChart();
  }, [loadChart]);

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      await reportsApi.downloadStudentPdf();
      toast.success(t('reports.studentDownloaded'));
    } catch {
      toast.error(t('reports.downloadError'));
    } finally {
      setDownloading(false);
    }
  };

  const chartData = useMemo(
    () =>
      timeline.map((point) => ({
        date: point.date.slice(5),
        count: point.count,
        fullDate: point.date,
      })),
    [timeline]
  );

  const totalSolved = timeline.reduce((sum, p) => sum + p.count, 0);
  const tickInterval = getTickInterval(isMobile, days);
  const useAngledLabels = isMobile && days > 7;
  const chartHeight = isMobile ? 260 : 320;

  const chartMargins = useMemo(
    () => ({
      top: 8,
      right: isMobile ? 4 : 12,
      left: isMobile ? -12 : 0,
      bottom: useAngledLabels ? 8 : 0,
    }),
    [isMobile, useAngledLabels]
  );

  return (
    <Paper
      sx={{
        p: { xs: 1.5, sm: 3 },
        overflow: 'hidden',
        maxWidth: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            wordBreak: 'break-word',
          }}
        >
          {t('profile.progress.title')}
        </Typography>

        <FormControl
          size="small"
          sx={{
            width: { xs: '100%', sm: 160 },
            flexShrink: 0,
          }}
        >
          <InputLabel>{t('profile.progress.period')}</InputLabel>
          <Select
            value={days}
            label={t('profile.progress.period')}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            {PERIOD_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {t('profile.progress.days', { count: option })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          size="small"
          startIcon={downloading ? <CircularProgress size={16} /> : <DownloadIcon />}
          onClick={handleDownloadReport}
          disabled={downloading}
          sx={{ width: { xs: '100%', sm: 'auto' }, flexShrink: 0 }}
        >
          {t('reports.downloadStudent')}
        </Button>
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
      >
        {t('profile.progress.totalInPeriod', { count: totalSolved, days })}
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : chartData.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
          {t('profile.progress.empty')}
        </Typography>
      ) : (
        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            height: chartHeight,
            overflow: 'hidden',
            mx: 'auto',
            '& .recharts-surface': {
              overflow: 'visible',
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={chartMargins}
              barCategoryGap={isMobile ? '10%' : '20%'}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                interval={tickInterval}
                tick={{
                  fontSize: isMobile ? 10 : 12,
                }}
                angle={useAngledLabels ? -45 : 0}
                textAnchor={useAngledLabels ? 'end' : 'middle'}
                height={useAngledLabels ? 56 : 32}
                tickMargin={isMobile ? 4 : 8}
              />
              <YAxis
                allowDecimals={false}
                width={isMobile ? 24 : 36}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickMargin={isMobile ? 2 : 4}
              />
              <Tooltip
                formatter={(value: number) => [value, t('profile.progress.solvedTasks')]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullDate ?? ''}
                contentStyle={{
                  fontSize: isMobile ? 12 : 14,
                  maxWidth: isMobile ? 200 : undefined,
                }}
              />
              <Bar
                dataKey="count"
                fill="#1976d2"
                radius={[4, 4, 0, 0]}
                maxBarSize={isMobile ? 12 : 32}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
};
