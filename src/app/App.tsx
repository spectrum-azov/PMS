import { RouterProvider } from 'react-router';
import { router } from './routes';
import { PersonnelProvider } from './context/PersonnelContext';
import { DictionariesProvider } from './context/DictionariesContext';
import { SettingsProvider } from './context/SettingsContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <SettingsProvider>
      <DictionariesProvider>
        <PersonnelProvider>
          <RouterProvider router={router} />
          <Toaster />
        </PersonnelProvider>
      </DictionariesProvider>
    </SettingsProvider>
  );
}