import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getDashboardData } from '../api/dashboardApi';
import { DashboardData } from '../api/types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, UserCheck, UserX, Award, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';

export function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    const result = await getDashboardData();
    if (result.success) {
      setData(result.data);
    } else {
      setError(result.message);
      toast.error(result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Огляд</h2>
          <p className="text-gray-600 mt-1">Загальна інформація про особовий склад</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-5 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j}>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Огляд</h2>
          <p className="text-gray-600 mt-1">Загальна інформація про особовий склад</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">{error || 'Не вдалося завантажити дані'}</p>
            <Button onClick={loadDashboard} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Спробувати ще раз
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <div className="text-3xl font-bold text-gray-900">{data.totalPersonnel}</div>
            <p className="text-sm text-gray-500 mt-1">
              {data.activePersonnel} активних
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
            <div className="text-3xl font-bold text-gray-900">{data.contractPersonnel}</div>
            <p className="text-sm text-gray-500 mt-1">
              {data.totalPersonnel > 0
                ? Math.round((data.contractPersonnel / data.totalPersonnel) * 100)
                : 0}% від загальної кількості
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
            <div className="text-3xl font-bold text-gray-900">{data.mobilizedPersonnel}</div>
            <p className="text-sm text-gray-500 mt-1">
              {data.totalPersonnel > 0
                ? Math.round((data.mobilizedPersonnel / data.totalPersonnel) * 100)
                : 0}% від загальної кількості
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
            <div className="text-3xl font-bold text-gray-900">{data.withAwards}</div>
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
              {data.unitStats.map((stat, index) => (
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
                      style={{ width: `${data.totalPersonnel > 0 ? (stat.count / data.totalPersonnel) * 100 : 0}%` }}
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
              {data.positionStats.map((stat, index) => (
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
                      style={{ width: `${data.totalPersonnel > 0 ? (stat.count / data.totalPersonnel) * 100 : 0}%` }}
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