import { Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../shared/lib/hooks';

export const ProfileInfoTab = () => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.user.user);

  if (!user) return null;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t('profile.infoTitle')}
      </Typography>
      <Typography sx={{ mb: 1 }}>
        {t('profile.firstName')}: {user.firstName}
      </Typography>
      <Typography sx={{ mb: 1 }}>
        {t('profile.lastName')}: {user.lastName}
      </Typography>
      <Typography sx={{ mb: 1 }}>
        {t('profile.email')}: {user.email}
      </Typography>
      <Typography>
        {t('profile.role')}: {t(`profile.role_${user.role}`, { defaultValue: user.role })}
      </Typography>
    </Paper>
  );
};
