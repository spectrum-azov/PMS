import { createHashRouter, useRouteError } from 'react-router';

import { Layout } from './pages/Layout';

// ---------------------------------------------------------------------------
// Chunk-load error recovery
// ---------------------------------------------------------------------------
// After a new GitHub Pages deployment the hashed chunk filenames change, but
// a visitor's browser may have cached the old index.html that still references
// the *old* hashes → 404 on every dynamic import.
//
// Strategy:
//   1. Each lazy route gets a single automatic reload attempt (sessionStorage
//      flag prevents an infinite loop).
//   2. RouteErrorFallback (the React Router errorElement) catches any error
//      that escapes the lazy loader – including the Suspense rejection – and
//      also triggers one reload before rendering a user-facing error screen.
// ---------------------------------------------------------------------------

/**
 * Returns a React Router `lazy` route record.
 * On failure it attempts one page reload (guarded by sessionStorage).
 */
function lazyRoute(
  factory: () => Promise<{ default: React.ComponentType<unknown> }>,
  chunkName: string,
) {
  return async (): Promise<{ Component: React.ComponentType<unknown> }> => {
    const key = `chunk-retry-${chunkName}`;
    try {
      const mod = await factory();
      // If we previously set a retry flag for this chunk and it now succeeded,
      // clean up so future navigations can retry again if needed.
      sessionStorage.removeItem(key);
      return { Component: mod.default };
    } catch (err) {
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        window.location.reload();
        // The reload will interrupt execution, but we still need to return
        // something valid – return a never-resolving promise to keep React
        // in the loading state until the reload happens.
        return new Promise(() => { });
      }
      // Already retried – surface the error so errorElement can catch it.
      throw err;
    }
  };
}

// ---------------------------------------------------------------------------
// Loading spinner (shared Suspense fallback)
// ---------------------------------------------------------------------------
function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Route error boundary
// ---------------------------------------------------------------------------
/**
 * Shown by React Router when a route (or its lazy component) throws.
 * Detects stale-chunk errors and auto-reloads once; otherwise renders
 * a user-friendly error screen.
 */
function RouteErrorFallback() {
  const error = useRouteError() as Error | undefined;

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

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------
export const router = createHashRouter([
  {
    path: '/',
    Component: Layout,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        index: true,
        lazy: lazyRoute(() => import('./pages/Dashboard'), 'Dashboard'),
        HydrateFallback: PageSpinner,
      },
      {
        path: 'personnel',
        lazy: lazyRoute(() => import('./pages/PersonnelRegistry'), 'PersonnelRegistry'),
        HydrateFallback: PageSpinner,
      },
      {
        path: 'personnel/new',
        lazy: lazyRoute(() => import('./pages/PersonForm'), 'PersonForm'),
        HydrateFallback: PageSpinner,
      },
      {
        path: 'personnel/import',
        lazy: lazyRoute(() => import('./pages/ImportPersonnel'), 'ImportPersonnel'),
        HydrateFallback: PageSpinner,
      },
      {
        path: 'personnel/:id',
        lazy: lazyRoute(() => import('./pages/PersonCard'), 'PersonCard'),
        HydrateFallback: PageSpinner,
      },
      {
        path: 'personnel/:id/edit',
        lazy: lazyRoute(() => import('./pages/PersonForm'), 'PersonForm-edit'),
        HydrateFallback: PageSpinner,
      },
      {
        path: 'units',
        lazy: lazyRoute(() => import('./pages/UnitsPage'), 'UnitsPage'),
        HydrateFallback: PageSpinner,
      },
      {
        path: 'positions',
        lazy: lazyRoute(() => import('./pages/PositionsPage'), 'PositionsPage'),
        HydrateFallback: PageSpinner,
      },
      {
        path: 'roles',
        lazy: lazyRoute(() => import('./pages/RolesPage'), 'RolesPage'),
        HydrateFallback: PageSpinner,
      },
      {
        path: 'settings',
        lazy: lazyRoute(() => import('./pages/SettingsPage'), 'SettingsPage'),
        HydrateFallback: PageSpinner,
      },
    ],
  },
]);