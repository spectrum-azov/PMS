import { createBrowserRouter, Navigate } from 'react-router';
import { lazy, Suspense } from 'react';
import { Layout } from './pages/Layout';

const PersonnelRegistry = lazy(() => import('./pages/PersonnelRegistry'));
const PersonCard = lazy(() => import('./pages/PersonCard'));
const PersonForm = lazy(() => import('./pages/PersonForm'));
const UnitsPage = lazy(() => import('./pages/UnitsPage'));
const PositionsPage = lazy(() => import('./pages/PositionsPage'));
const RolesPage = lazy(() => import('./pages/RolesPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ImportPersonnel = lazy(() => import('./pages/ImportPersonnel'));

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    }>
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: () => <Navigate to="/personnel" replace />,
      },
      {
        path: 'personnel',
        Component: () => <LazyPage><PersonnelRegistry /></LazyPage>,
      },
      {
        path: 'personnel/new',
        Component: () => <LazyPage><PersonForm /></LazyPage>,
      },
      {
        path: 'personnel/import',
        Component: () => <LazyPage><ImportPersonnel /></LazyPage>,
      },
      {
        path: 'personnel/:id',
        Component: () => <LazyPage><PersonCard /></LazyPage>,
      },
      {
        path: 'personnel/:id/edit',
        Component: () => <LazyPage><PersonForm /></LazyPage>,
      },
      {
        path: 'units',
        Component: () => <LazyPage><UnitsPage /></LazyPage>,
      },
      {
        path: 'positions',
        Component: () => <LazyPage><PositionsPage /></LazyPage>,
      },
      {
        path: 'roles',
        Component: () => <LazyPage><RolesPage /></LazyPage>,
      },
      {
        path: 'settings',
        Component: () => <LazyPage><SettingsPage /></LazyPage>,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_URL,
});