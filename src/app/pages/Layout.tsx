import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Users, Settings, Building2, Briefcase, UserCog, Menu, X, Languages, LayoutDashboard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { ThemeToggle } from '../components/theme-toggle';
import { NotificationCenter } from '../components/NotificationCenter';


import logo from '../../assets/logo.png';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { lang, setLang, t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: t('nav_overview'), path: '/', icon: LayoutDashboard },
    { name: t('nav_registry'), path: '/personnel', icon: Users },
  ];

  const dictionaryNav = [
    { name: t('nav_units'), path: '/units', icon: Building2 },
    { name: t('nav_positions'), path: '/positions', icon: Briefcase },
    { name: t('nav_roles'), path: '/roles', icon: UserCog },
  ];
  const closeSidebar = () => setSidebarOpen(false);

  const toggleLanguage = () => {
    setLang(lang === 'uk' ? 'en' : 'uk');
  };

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="shrink-0 bg-background border-b border-border z-50">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Hamburger button - mobile only */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={t('nav_open_menu')}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              <div className="flex items-center justify-center w-10 h-10 shrink-0 overflow-hidden rounded-lg">
                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-foreground">{settings.organizationName}</h1>
                <p className="text-sm text-muted-foreground">{settings.organizationSubtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="px-2"
                title={lang === 'uk' ? 'Switch to English' : 'Перемкнути на українську'}
              >
                <Languages className="w-4 h-4 mr-1" />
                <span className="font-medium text-sm">
                  {lang === 'uk' ? 'UA' : 'EN'}
                </span>
              </Button>
              <NotificationCenter /> */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/settings')}
              >
                <Settings className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{t('nav_settings')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
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
            fixed md:relative z-40 md:z-auto
            w-64 shrink-0 bg-background border-r border-border
            h-full
            transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
            flex flex-col
          `}
        >
          {/* Mobile sidebar header */}
          <div className="flex items-center justify-between p-4 border-b md:hidden shrink-0">
            <div>
              <p className="text-sm font-semibold text-foreground">{settings.organizationName}</p>
              <p className="text-xs text-muted-foreground">{settings.organizationSubtitle}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={closeSidebar}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
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
              <p className="text-xs text-muted-foreground mb-2">{t('nav_directories')}</p>
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

            {/* <Separator className="my-4" />

            <div className="px-4 py-3">
              <Link to="/personnel/import" onClick={closeSidebar}>
                <Button
                  variant={location.pathname === '/personnel/import' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <Upload className="w-4 h-4 mr-3" />
                  {t('import_title')}
                </Button>
              </Link>
            </div> */}

          </div>
        </aside>

        {/* Main Content */}
        <main className="flex flex-col flex-1 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

