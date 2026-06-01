import React from 'react';
import { Container, Typography, Link, Card, CardContent, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '../../../features/auth-by-email/ui/LoginForm';

export const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexGrow: 1,
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={3} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              {t('auth.login.title')}
            </Typography>
            <LoginForm />
            <Typography align="center" sx={{ mt: 2 }}>
              {t('auth.login.registerLink')}{' '}
              <Link component={RouterLink} to="/register">
                {t('auth.register.submit')}
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
