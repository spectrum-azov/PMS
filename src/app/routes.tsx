import { createHashRouter, Navigate, useRouteError } from 'react-router';
import { lazy, Suspense, type ComponentType } from 'react';
import { Layout } from './pages/Layout';

/**
 * Wraps a dynamic import with a single-retry mechanism.
 * After a new deployment the chunk hashes change, but a cached index.html
 * still references the old ones → 404.  On failure we reload the page once
 * so the browser fetches the new index.html with the correct hashes.
 * sessionStorage guards against an infinite reload loop.
 */
function lazyRetry(
  factory: () => Promise<{ default: ComponentType<unknown> }>,
  chunkName: string,
) {
  return lazy(() =>
    factory().catch(() => {
      const key = `chunk-retry-${chunkName}`;
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        window.location.reload();
      }
      // If we already reloaded once and it still fails – surface the error
      return Promise.reject(
        new Error(`Failed to load chunk "${chunkName}" after retry.`),
      );
    }),
  );
}

const PersonnelRegistry = lazyRetry(() => import('./pages/PersonnelRegistry'), 'PersonnelRegistry');
const PersonCard = lazyRetry(() => import('./pages/PersonCard'), 'PersonCard');
const PersonForm = lazyRetry(() => import('./pages/PersonForm'), 'PersonForm');
const UnitsPage = lazyRetry(() => import('./pages/UnitsPage'), 'UnitsPage');
const PositionsPage = lazyRetry(() => import('./pages/PositionsPage'), 'PositionsPage');
const RolesPage = lazyRetry(() => import('./pages/RolesPage'), 'RolesPage');
const SettingsPage = lazyRetry(() => import('./pages/SettingsPage'), 'SettingsPage');
const ImportPersonnel = lazyRetry(() => import('./pages/ImportPersonnel'), 'ImportPersonnel');

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

/**
 * Shown by React Router when a route (or its lazy component) throws.
 * Detects stale-chunk errors and auto-reloads once; otherwise renders
 * a user-friendly error screen.
 */
function RouteErrorFallback() {
  const error = useRouteError() as Error | undefined;

  // If this looks like a chunk-load failure and we haven't retried yet
  const isChunkError =
    error?.message?.includes('Failed to fetch dynamically imported module') ||
    error?.message?.includes('Loading chunk') ||
    error?.message?.includes('Loading CSS chunk');

  if (isChunkError && !sessionStorage.getItem('route-error-reload')) {
    sessionStorage.setItem('route-error-reload', '1');
    window.location.reload();
    return null;
  }

  // Clear the flag so a future real error can retry again
  sessionStorage.removeItem('route-error-reload');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-xl font-semibold text-foreground">
          Щось пішло не так
        </h2>
        <p className="text-muted-foreground text-sm">
          {error?.message || 'Виникла непередбачена помилка.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Перезавантажити
        </button>
      </div>
    </div>
  );
}

export const router = createHashRouter([
  {
    path: '/',
    Component: Layout,
    errorElement: <RouteErrorFallback />,
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
]);