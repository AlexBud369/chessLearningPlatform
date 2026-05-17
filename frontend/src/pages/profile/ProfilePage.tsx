import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Header } from '../../widgets/header/Header';
import { Footer } from '../../widgets/footer/Footer';
import { useAppSelector } from '../../shared/lib/hooks';

export const ProfilePage = () => {
  const { t } = useTranslation();
  const user = useAppSelector(state => state.user.user);

  if (!user) return null;

  const getRoleTranslation = (role: string) => {
    const key = `profile.role_${role}`;
    return t(key, { defaultValue: role });
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {t('profile.title')}
          </Typography>
          <Typography>
            {t('profile.firstName')}: {user.firstName}
          </Typography>
          <Typography>
            {t('profile.lastName')}: {user.lastName}
          </Typography>
          <Typography>
            {t('profile.email')}: {user.email}
          </Typography>
          <Typography>
            {t('profile.role')}: {getRoleTranslation(user.role)}
          </Typography>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};