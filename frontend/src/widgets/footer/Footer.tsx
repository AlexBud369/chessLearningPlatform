import { Box, Container, Typography, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {t('footer.copyright', { year: currentYear })}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          <Link href="/" color="inherit">
            {t('footer.about')}
          </Link>{' '}
          |{' '}
          <Link href="/" color="inherit">
            {t('footer.contact')}
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};