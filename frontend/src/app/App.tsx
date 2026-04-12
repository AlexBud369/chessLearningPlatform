import { StoreProvider } from './providers/StoreProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { RouterProvider } from './providers/RouterProvider';
import { SessionInitializer } from './providers/SessionInitializer';
import { I18nProvider } from './providers/I18nProvider';

function App() {
  return (
     <StoreProvider>
      <ThemeProvider>
        <I18nProvider>
          <SessionInitializer>
          <RouterProvider />
        </SessionInitializer>
        </I18nProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}

export default App;
