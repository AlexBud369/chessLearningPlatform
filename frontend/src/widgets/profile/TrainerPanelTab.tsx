import { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TrainerStudentsProgressTab } from './TrainerStudentsProgressTab';
import { TrainerAssignCourseSection } from './TrainerAssignCourseSection';
import { TrainerStudentsManageSection } from './TrainerStudentsManageSection';
import { TrainerContentTab } from './TrainerContentTab';

export const TrainerPanelTab = () => {
  const { t } = useTranslation();
  const [subTab, setSubTab] = useState(0);

  return (
    <Box>
      <Tabs
        value={subTab}
        onChange={(_, value) => setSubTab(value)}
        sx={{ mb: 3 }}
        variant="scrollable"
        allowScrollButtonsMobile
      >
        <Tab label={t('profile.trainer.subTabs.progress')} />
        <Tab label={t('profile.trainer.subTabs.students')} />
        <Tab label={t('profile.trainer.subTabs.assign')} />
        <Tab label={t('profile.trainer.subTabs.content')} />
      </Tabs>

      {subTab === 0 && <TrainerStudentsProgressTab />}
      {subTab === 1 && <TrainerStudentsManageSection />}
      {subTab === 2 && <TrainerAssignCourseSection />}
      {subTab === 3 && <TrainerContentTab />}
    </Box>
  );
};
