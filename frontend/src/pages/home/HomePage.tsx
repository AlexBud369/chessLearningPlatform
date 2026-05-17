import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Header } from '../../widgets/header/Header';
import { Footer } from '../../widgets/footer/Footer';

export const HomePage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <Container>
        <Typography variant="h2" align="center">
          {t('home.title')}
        </Typography>
      </Container>
      <Footer />
    </>
  );
};