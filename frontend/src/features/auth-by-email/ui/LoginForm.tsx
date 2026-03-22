import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../shared/lib/hooks';
import { setError } from '../../../entities/user/model/store';
import { authApi } from '../../../shared/api/authApi';
import { useAuthSubmit } from '../model/useAuthSubmit';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.user);
  const { submit } = useAuthSubmit(authApi.login);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    await submit(data);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('email', e.target.value);
    if (error) {
      dispatch(setError(null));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 400, mx: 'auto' }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
      <Button type="submit" variant="contained" fullWidth disabled={isLoading}>
        {isLoading ? t('auth.login.submitting') : t('auth.login.submit')}
      </Button>
    </Box>
  );
};