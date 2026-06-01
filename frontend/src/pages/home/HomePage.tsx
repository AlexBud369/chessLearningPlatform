import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ExtensionIcon from '@mui/icons-material/Extension';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../shared/constants/routes';

const BACKGROUND_IMAGE = '/images/background/Chess-Rising-Stars-Grand-Prix-2.jpg';

const STEP_ICONS = [
  PersonAddIcon,
  MenuBookIcon,
  ExtensionIcon,
  AnalyticsIcon,
  AccountCircleIcon,
  SportsEsportsIcon,
] as const;

export const HomePage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const steps = t('home.steps', { returnObjects: true }) as Array<{ title: string; text: string }>;

  return (
    <Box sx={{ flexGrow: 1, width: '100%' }}>
      {/* Hero with background */}
      <Box
        sx={{
          position: 'relative',
          mb: { xs: 4, md: 6 },
          borderRadius: { xs: 2, md: 3 },
          overflow: 'hidden',
          minHeight: { xs: 280, sm: 360, md: 420 },
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          backgroundImage: `linear-gradient(135deg, rgba(30, 40, 20, 0.82) 0%, rgba(90, 122, 62, 0.75) 100%), url(${BACKGROUND_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: theme.shadows[6],
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
          <Stack spacing={2} alignItems={{ xs: 'center', md: 'flex-start' }} textAlign={{ xs: 'center', md: 'left' }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: '#fff',
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                maxWidth: 720,
                textShadow: '0 2px 12px rgba(0,0,0,0.35)',
              }}
            >
              {t('home.title')}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.92)',
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.2rem' },
                maxWidth: 560,
                lineHeight: 1.5,
              }}
            >
              {t('home.subtitle')}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1 }}>
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to={ROUTES.REGISTER}
                sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
              >
                {t('home.ctaRegister')}
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={RouterLink}
                to={ROUTES.COURSES}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.7)',
                  '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
                }}
              >
                {t('home.ctaCourses')}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* How to use */}
      <Container maxWidth="lg" sx={{ pb: { xs: 2, md: 4 } }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600, fontSize: { xs: '1.5rem', md: '2rem' }, mb: 1 }}
        >
          {t('home.howToTitle')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 3, md: 4 }, maxWidth: 720 }}>
          {t('home.howToIntro')}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: { xs: 2, md: 3 },
          }}
        >
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? MenuBookIcon;
            return (
              <Paper
                key={step.title}
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  height: '100%',
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    }}
                  >
                    <Icon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {t('home.stepLabel', { number: index + 1 })}
                    </Typography>
                    <Typography variant="h6" component="h3" sx={{ fontSize: '1.05rem', fontWeight: 600, mb: 0.5 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
                      {step.text}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            );
          })}
        </Box>

        <Paper
          sx={{
            mt: { xs: 4, md: 5 },
            p: { xs: 2.5, md: 3 },
            borderRadius: 2,
            bgcolor: (muiTheme) =>
              muiTheme.palette.mode === 'light' ? 'grey.50' : 'background.paper',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
            {t('home.trainerBlockTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: 800 }}>
            {t('home.trainerBlockText')}
          </Typography>
          <Button variant="contained" component={RouterLink} to={ROUTES.PROFILE}>
            {t('home.trainerBlockCta')}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};
