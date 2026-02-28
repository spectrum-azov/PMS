import { useState, useEffect } from 'react';
import { getDashboardData } from '../api/dashboardApi';
import { DashboardData } from '../api/types';
import { Card, CardContent } from '../components/ui/card';
import { RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { DashboardCharts } from '../components/dashboard/DashboardCharts';
import { DashboardQuickActions } from '../components/dashboard/DashboardQuickActions';
import { DashboardLoading } from '../components/dashboard/DashboardLoading';

export default function Dashboard() {
  const { t } = useLanguage();
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
    return <DashboardLoading />;
  }

  if (error || !data) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-semibold text-foreground">{t('dashboard_title')}</h2>
          <p className="text-muted-foreground mt-1">{t('dashboard_subtitle')}</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">{error || t('dashboard_failed_to_load')}</p>
            <Button onClick={loadDashboard} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('common_retry')}
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
        <h2 className="text-3xl font-semibold text-foreground">{t('dashboard_title')}</h2>
        <p className="text-muted-foreground mt-1">{t('dashboard_subtitle')}</p>
      </div>

      <DashboardStats data={data} />
      <DashboardCharts data={data} />
      <DashboardQuickActions />
    </div>
  );
}