import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './pages/Layout';
import { PersonnelRegistry } from './pages/PersonnelRegistry';
import { PersonCard } from './pages/PersonCard';
import { PersonForm } from './pages/PersonForm';
import { UnitsPage } from './pages/UnitsPage';
import { PositionsPage } from './pages/PositionsPage';
import { RolesPage } from './pages/RolesPage';
import { SettingsPage } from './pages/SettingsPage';

import { ImportPersonnel } from './pages/ImportPersonnel';

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
        Component: PersonnelRegistry,
      },
      {
        path: 'personnel/new',
        Component: PersonForm,
      },
      {
        path: 'personnel/import',
        Component: ImportPersonnel,
      },
      {
        path: 'personnel/:id',
        Component: PersonCard,
      },
      {
        path: 'personnel/:id/edit',
        Component: PersonForm,
      },
      {
        path: 'units',
        Component: UnitsPage,
      },
      {
        path: 'positions',
        Component: PositionsPage,
      },
      {
        path: 'roles',
        Component: RolesPage,
      },
      {
        path: 'settings',
        Component: SettingsPage,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_URL,
});