import { Outlet, Link, useLocation } from 'react-router';
import { Users, LayoutDashboard, Settings, Shield, Building2, Briefcase, UserCog } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';

export function Layout() {
  const location = useLocation();

  const navigation = [
    { name: 'Огляд', path: '/', icon: LayoutDashboard },
    { name: 'Реєстр людей', path: '/personnel', icon: Users },
  ];

  const dictionaryNav = [
    { name: 'Підрозділи', path: '/units', icon: Building2 },
    { name: 'Посади', path: '/positions', icon: Briefcase },
    { name: 'Ролі', path: '/roles', icon: UserCog },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Управління особовим складом</h1>
                <p className="text-sm text-gray-500">Вузол зв'язку 1-го корпусу</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Налаштування
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
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
                  <Link key={item.path} to={item.path}>
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
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}