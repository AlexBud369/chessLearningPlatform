import { Box } from '@mui/material';
import { StoreProvider } from './providers/StoreProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { RouterProvider } from './providers/RouterProvider';
import { SessionInitializer } from './providers/SessionInitializer';
import { I18nProvider } from './providers/I18nProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <StoreProvider>
      <ThemeProvider>
        <I18nProvider>
          <SessionInitializer>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
              <RouterProvider />
            </Box>
            <ToastContainer position="bottom-right" autoClose={3000} />
          </SessionInitializer>
        </I18nProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}

export default App;