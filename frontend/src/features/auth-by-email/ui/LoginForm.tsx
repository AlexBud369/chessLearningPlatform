import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../../shared/api/authApi';
import { useAuthSubmit } from '../model/useAuthSubmit';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const { t } = useTranslation();
  const { submit } = useAuthSubmit(authApi.login);
  const { register, handleSubmit, formState: { errors }, setError, setValue } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    const result = await submit(data);
    if (!result.success && result.error) {
      if (result.errorType === 'root') {
        setError('root', { message: result.error });
      } else if (result.errorType === 'field') {
        setError('email', { message: result.error });
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('email', e.target.value);
    if (errors.root) {
      setError('root', { message: undefined });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 400, mx: 'auto' }}>
      {errors.root && <Alert severity="error" sx={{ mb: 2 }}>{errors.root.message}</Alert>}
      <TextField
        fullWidth
        label={t('auth.login.email')}
        margin="normal"
        {...register('email', { required: t('auth.errors.emailRequired') })}
        error={!!errors.email}
        helperText={errors.email?.message}
        onChange={handleEmailChange}
      />
      <TextField
        fullWidth
        label={t('auth.login.password')}
        type="password"
        margin="normal"
        {...register('password', { required: t('auth.errors.passwordRequired') })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button type="submit" variant="contained" fullWidth disabled={false}>
        {t('auth.login.submit')}
      </Button>
    </Box>
  );
};