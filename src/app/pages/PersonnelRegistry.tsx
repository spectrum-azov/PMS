import { useNavigate } from 'react-router';
import { usePersonnel } from '../context/PersonnelContext';
import { PersonnelFilters } from '../components/PersonnelFilters';
import { PersonnelTable } from '../components/PersonnelTable';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { UserPlus, Download, Upload } from 'lucide-react';

export function PersonnelRegistry() {
  const navigate = useNavigate();
  const { filteredPersonnel, filters, setFilters } = usePersonnel();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Реєстр людей</h2>
          <p className="text-gray-600 mt-1">
            Знайдено: <span className="font-medium">{filteredPersonnel.length}</span> записів
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Імпорт
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Експорт
          </Button>
          <Button onClick={() => navigate('/personnel/new')}>
            <UserPlus className="w-4 h-4 mr-2" />
            Додати особу
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <PersonnelFilters filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      {/* Table */}
      <PersonnelTable personnel={filteredPersonnel} />
    </div>
  );
}
