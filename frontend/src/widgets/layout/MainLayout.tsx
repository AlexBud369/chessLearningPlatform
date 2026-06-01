import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Header } from '../header/Header';
import { Footer } from '../footer/Footer';
import { MAIN_CONTENT_PADDING } from '../../shared/constants/pageLayout';

export const MainLayout = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
    }}
  >
    <Box component="header" sx={{ flexShrink: 0 }}>
      <Header />
    </Box>

    <Box
      component="main"
      sx={{
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
        ...MAIN_CONTENT_PADDING,
      }}
    >
      <Outlet />
    </Box>

    <Box component="footer" sx={{ flexShrink: 0, mt: 'auto' }}>
      <Footer />
    </Box>
  </Box>
);
