import { useNavigate } from 'react-router';
import { usePersonnel } from '../context/PersonnelContext';
import { PersonnelFilters } from '../components/PersonnelFilters';
import { PersonnelTable } from '../components/PersonnelTable';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { UserPlus, Download, Upload, RefreshCw } from 'lucide-react';

export function PersonnelRegistry() {
  const navigate = useNavigate();
  const { filteredPersonnel, filters, setFilters, loading, error, reload } = usePersonnel();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Реєстр людей</h2>
          <p className="text-gray-600 mt-1">
            {loading ? (
              <Skeleton className="h-4 w-32 inline-block" />
            ) : (
              <>Знайдено: <span className="font-medium">{filteredPersonnel.length}</span> записів</>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Імпорт</span>
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Експорт</span>
          </Button>
          <Button onClick={() => navigate('/personnel/new')}>
            <UserPlus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Додати особу</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <PersonnelFilters filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      {/* Loading / Error / Table */}
      {loading ? (
        <Card>
          <CardContent className="py-8 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={reload} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Спробувати ще раз
            </Button>
          </CardContent>
        </Card>
      ) : (
        <PersonnelTable personnel={filteredPersonnel} />
      )}
    </div>
  );
}
