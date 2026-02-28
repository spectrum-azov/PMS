import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import { PersonnelProvider } from './context/PersonnelContext';
import { DictionariesProvider } from './context/DictionariesContext';
import { SettingsProvider } from './context/SettingsContext';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './components/theme-provider';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={["light", "dark", "spectrum", "spectrum-contrast", "system"]}
      value={{ light: "light", dark: "dark", spectrum: "spectrum", "spectrum-contrast": "spectrum-contrast" }}
    >
      <LanguageProvider>
        <SettingsProvider>
          <DictionariesProvider>
            <PersonnelProvider>
              <ErrorBoundary>
                <RouterProvider router={router} />
              </ErrorBoundary>
              <Toaster />
            </PersonnelProvider>
          </DictionariesProvider>
        </SettingsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}