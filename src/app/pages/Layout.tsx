import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Users, LayoutDashboard, Settings, Shield, Building2, Briefcase, UserCog, Menu, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { useSettings } from '../context/SettingsContext';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Огляд', path: '/', icon: LayoutDashboard },
    { name: 'Реєстр людей', path: '/personnel', icon: Users },
  ];

  const dictionaryNav = [
    { name: 'Підрозділи', path: '/units', icon: Building2 },
    { name: 'Посади', path: '/positions', icon: Briefcase },
    { name: 'Ролі', path: '/roles', icon: UserCog },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Hamburger button - mobile only */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Відкрити меню"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-gray-900">{settings.organizationName}</h1>
                <p className="text-sm text-gray-500">{settings.organizationSubtitle}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Налаштування</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:static top-0 left-0 z-40 md:z-auto
            w-64 bg-white border-r border-gray-200
            h-full md:min-h-[calc(100vh-73px)]
            transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
          `}
        >
          {/* Mobile sidebar header */}
          <div className="flex items-center justify-between p-4 border-b md:hidden">
            <div>
              <p className="text-sm font-semibold text-gray-900">{settings.organizationName}</p>
              <p className="text-xs text-gray-500">{settings.organizationSubtitle}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={closeSidebar}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path} onClick={closeSidebar}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <Separator className="my-4" />

          <div className="px-4 py-3">
            <p className="text-xs text-gray-500 mb-2">Довідники</p>
            <div className="space-y-1">
              {dictionaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link key={item.path} to={item.path} onClick={closeSidebar}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="sm"
                      className="w-full justify-start text-xs"
                    >
                      <Icon className="w-3 h-3 mr-2" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
