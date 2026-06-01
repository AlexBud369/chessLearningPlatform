import { useState } from 'react';
import { Container, Tab, Tabs, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../shared/lib/hooks';
import { ProfileInfoTab } from '../../widgets/profile/ProfileInfoTab';
import { PlayerMyCoursesTab } from '../../widgets/profile/PlayerMyCoursesTab';
import { PlayerProgressTab } from '../../widgets/profile/PlayerProgressTab';
import { PlayerFavoritesTab } from '../../widgets/profile/PlayerFavoritesTab';
import { PlayerGamesTab } from '../../widgets/profile/PlayerGamesTab';
import { TrainerPanelTab } from '../../widgets/profile/TrainerPanelTab';
import { AdminUsersTab } from '../../widgets/profile/AdminUsersTab';

export const ProfilePage = () => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.user.user);
  const [tab, setTab] = useState(0);

  if (!user) return null;

  const isPlayer = user.role === 'player';
  const isTrainer = user.role === 'trainer';
  const isAdmin = user.role === 'admin';

  const tabs: { label: string; panel: React.ReactNode }[] = [
    { label: t('profile.tabs.info'), panel: <ProfileInfoTab /> },
  ];

  if (isPlayer) {
    tabs.push({ label: t('profile.tabs.myCourses'), panel: <PlayerMyCoursesTab /> });
    tabs.push({ label: t('profile.tabs.progress'), panel: <PlayerProgressTab /> });
    tabs.push({ label: t('profile.tabs.favorites'), panel: <PlayerFavoritesTab /> });
    tabs.push({ label: t('profile.tabs.games'), panel: <PlayerGamesTab /> });
  }

  if (isTrainer) {
    tabs.push({ label: t('profile.tabs.trainer'), panel: <TrainerPanelTab /> });
    tabs.push({ label: t('profile.tabs.games'), panel: <PlayerGamesTab /> });
  }

  if (isAdmin) {
    tabs.push({ label: t('profile.tabs.admin'), panel: <AdminUsersTab /> });
  }

  const activeTab = Math.min(tab, tabs.length - 1);

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 2, sm: 4 },
        px: { xs: 1.5, sm: 3 },
        flexGrow: 1,
        maxWidth: '100%',
        overflowX: 'auto',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
        {t('profile.title')}
      </Typography>

      {tabs.length > 1 && (
        <Tabs
          value={activeTab}
          onChange={(_, value) => setTab(value)}
          sx={{
            mb: 3,
            maxWidth: '100%',
            '& .MuiTab-root': {
              minWidth: { xs: 'auto', sm: 90 },
              px: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            },
          }}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {tabs.map((item) => (
            <Tab key={item.label} label={item.label} />
          ))}
        </Tabs>
      )}

      {tabs[activeTab]?.panel}
    </Container>
  );
};
