import React from 'react';
import { Container, Typography, Link, Card, CardContent, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RegisterForm } from '../../../features/auth-by-email/ui/RegisterForm';
import { Header } from '../../../widgets/header/Header';
import { Footer } from '../../../widgets/footer/Footer';

export const RegisterPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Container maxWidth="sm">
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" align="center" gutterBottom>
                {t('auth.register.title')}
              </Typography>
              <RegisterForm />
              <Typography align="center" sx={{ mt: 2 }}>
                {t('auth.register.loginLink')}{' '}
                <Link component={RouterLink} to="/login">
                  {t('auth.login.submit')}
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
      <Footer />
    </>
  );
};