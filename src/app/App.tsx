import { RouterProvider } from 'react-router';
import { router } from './routes';
import { PersonnelProvider } from './context/PersonnelContext';
import { DictionariesProvider } from './context/DictionariesContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <DictionariesProvider>
      <PersonnelProvider>
        <RouterProvider router={router} />
        <Toaster />
      </PersonnelProvider>
    </DictionariesProvider>
  );
}