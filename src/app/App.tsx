import { RouterProvider } from 'react-router';
import { router } from './routes';
import { PersonnelProvider } from './context/PersonnelContext';
import { DictionariesProvider } from './context/DictionariesContext';
import { SettingsProvider } from './context/SettingsContext';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './components/theme-provider';

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={["light", "dark", "spectrum", "system"]}
      value={{ light: "light", dark: "dark", spectrum: "spectrum" }}
    >
      <LanguageProvider>
        <SettingsProvider>
          <DictionariesProvider>
            <PersonnelProvider>
              <RouterProvider router={router} />
              <Toaster />
            </PersonnelProvider>
          </DictionariesProvider>
        </SettingsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}