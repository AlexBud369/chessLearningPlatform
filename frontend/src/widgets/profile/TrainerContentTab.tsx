import { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TrainerCoursesSection } from './TrainerCoursesSection';
import { TrainerLessonsSection } from './TrainerLessonsSection';
import { TrainerTasksSection } from './TrainerTasksSection';

export const TrainerContentTab = () => {
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
        <Tab label={t('trainerContent.tabCourses')} />
        <Tab label={t('trainerContent.tabLessons')} />
        <Tab label={t('trainerContent.tabTasks')} />
      </Tabs>

      {subTab === 0 && <TrainerCoursesSection />}
      {subTab === 1 && <TrainerLessonsSection />}
      {subTab === 2 && <TrainerTasksSection />}
    </Box>
  );
};
