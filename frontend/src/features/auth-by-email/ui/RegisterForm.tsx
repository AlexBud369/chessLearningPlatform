import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Alert, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../shared/lib/hooks';
import { setError } from '../../../entities/user/model/store';
import { authApi } from '../../../shared/api/authApi';
import { RegisterCredentials } from '../../../shared/types/user';
import { useAuthSubmit } from '../model/useAuthSubmit';

interface RegisterFormData extends RegisterCredentials {
  confirmPassword: string;
}

export const RegisterForm = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.user);
  const { submit } = useAuthSubmit(async (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    return authApi.register(registerData);
  });
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
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
        label={t('auth.register.firstName')}
        margin="normal"
        {...register('first_name', { required: t('auth.errors.firstNameRequired') })}
        error={!!errors.first_name}
        helperText={errors.first_name?.message}
      />
      <TextField
        fullWidth
        label={t('auth.register.lastName')}
        margin="normal"
        {...register('last_name', { required: t('auth.errors.lastNameRequired') })}
        error={!!errors.last_name}
        helperText={errors.last_name?.message}
      />
      <TextField
        fullWidth
        label={t('auth.register.email')}
        margin="normal"
        {...register('email', {
          required: t('auth.errors.emailRequired'),
          pattern: {
            value: /^\S+@\S+$/i,
            message: t('auth.errors.emailInvalid')
          }
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
        onChange={handleEmailChange}
      />
      <TextField
        fullWidth
        label={t('auth.register.password')}
        type="password"
        margin="normal"
        {...register('password', {
          required: t('auth.errors.passwordRequired'),
          minLength: {
            value: 6,
            message: t('auth.errors.passwordMinLength')
          }
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        fullWidth
        label={t('auth.register.confirmPassword')}
        type="password"
        margin="normal"
        {...register('confirmPassword', {
          required: t('auth.errors.confirmPasswordRequired'),
          validate: (value) => value === watch('password') || t('auth.errors.passwordsMismatch')
        })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      <TextField
        select
        fullWidth
        label={t('auth.register.role')}
        margin="normal"
        defaultValue="player"
        {...register('role')}
      >
        <MenuItem value="player">{t('profile.role_player')}</MenuItem>
        <MenuItem value="trainer">{t('profile.role_trainer')}</MenuItem>
      </TextField>
      <Button type="submit" variant="contained" fullWidth disabled={isLoading} sx={{ mt: 2 }}>
        {isLoading ? t('auth.register.submitting') : t('auth.register.submit')}
      </Button>
    </Box>
  );
};