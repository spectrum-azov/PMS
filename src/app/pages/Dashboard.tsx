import { useNavigate } from 'react-router';
import { usePersonnel } from '../context/PersonnelContext';
import { useDictionaries } from '../context/DictionariesContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, UserCheck, UserX, Award, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const { personnel } = usePersonnel();
  const { units, positions } = useDictionaries();

  // Статистика
  const activePersonnel = personnel.filter(p => p.status === 'Служить').length;
  const contractPersonnel = personnel.filter(p => p.serviceType === 'Контракт').length;
  const mobilizedPersonnel = personnel.filter(p => p.serviceType === 'Мобілізований').length;
  const withAwards = personnel.filter(p => p.awards && p.awards.length > 0).length;

  // Розподіл по підрозділам
  const unitStats = units
    .filter(u => u.parentId === '3') // Групи вузла зв'язку
    .map(unit => ({
      name: unit.name,
      count: personnel.filter(p => p.unitId === unit.id).length,
      abbreviation: unit.abbreviation
    }))
    .filter(stat => stat.count > 0);

  // Розподіл по посадах
  const positionStats = positions
    .map(position => ({
      name: position.name,
      count: personnel.filter(p => p.positionId === position.id).length,
      category: position.category
    }))
    .filter(stat => stat.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Огляд</h2>
        <p className="text-gray-600 mt-1">Загальна інформація про особовий склад</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Всього особового складу
            </CardTitle>
            <Users className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{personnel.length}</div>
            <p className="text-sm text-gray-500 mt-1">
              {activePersonnel} активних
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Контрактники
            </CardTitle>
            <UserCheck className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{contractPersonnel}</div>
            <p className="text-sm text-gray-500 mt-1">
              {Math.round((contractPersonnel / personnel.length) * 100)}% від загальної кількості
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Мобілізовані
            </CardTitle>
            <UserX className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{mobilizedPersonnel}</div>
            <p className="text-sm text-gray-500 mt-1">
              {Math.round((mobilizedPersonnel / personnel.length) * 100)}% від загальної кількості
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              З нагородами
            </CardTitle>
            <Award className="w-5 h-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{withAwards}</div>
            <p className="text-sm text-gray-500 mt-1">
              Нагороджені військовослужбовці
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* По підрозділам */}
        <Card>
          <CardHeader>
            <CardTitle>Розподіл по підрозділам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {unitStats.map((stat, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        {stat.abbreviation}
                      </span>
                      <span className="text-xs text-gray-500">
                        {stat.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{stat.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(stat.count / personnel.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* По посадам */}
        <Card>
          <CardHeader>
            <CardTitle>Топ-5 посад</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {positionStats.map((stat, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        {stat.name}
                      </span>
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                        {stat.category}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{stat.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${(stat.count / personnel.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Швидкі дії
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
              onClick={() => navigate('/personnel/new')}
            >
              <Users className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-700">Додати особу</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-center">
              <Award className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-700">Додати нагороду</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-700">Формувати звіт</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}