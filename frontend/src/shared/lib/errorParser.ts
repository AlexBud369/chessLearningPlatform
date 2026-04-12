export const parseAuthError = (err: any, t: (key: string) => string): string => {
  const status = err.response?.status;
  const data = err.response?.data;

  if (status === 409) {
    return t('auth.errors.userAlreadyExists');
  }

  if (status === 401) {
    return t('auth.errors.invalidCredentials');
  }

  if (status === 400 && data?.errors && Array.isArray(data.errors)) {
    const emailError = data.errors.find((e: any) => e.path === 'email');
    if (emailError) {
      return emailError.msg || t('auth.errors.emailInvalid');
    }
    return data.errors.map((e: any) => e.msg).join(', ');
  }

  if (data?.message) {
    return data.message;
  }

  return t('auth.errors.registrationFailed');
};