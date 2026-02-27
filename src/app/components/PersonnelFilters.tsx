import { Search, Filter, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { PersonnelFilters as Filters } from '../types/personnel';
import { useDictionaries } from '../context/DictionariesContext';
import { Badge } from './ui/badge';
import { useLanguage } from '../context/LanguageContext';

interface PersonnelFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  actionSlot?: React.ReactNode;
}

export function PersonnelFilters({ filters, onFiltersChange, actionSlot }: PersonnelFiltersProps) {
  const { units, positions, roles } = useDictionaries();
  const { t } = useLanguage();

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const handleUnitChange = (value: string) => {
    onFiltersChange({ ...filters, unitId: value === 'all' ? undefined : value });
  };

  const handlePositionChange = (value: string) => {
    onFiltersChange({ ...filters, positionId: value === 'all' ? undefined : value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value === 'all' ? undefined : value as any });
  };

  const handleServiceTypeChange = (value: string) => {
    onFiltersChange({ ...filters, serviceType: value === 'all' ? undefined : value as any });
  };

  const handleRoleChange = (value: string) => {
    onFiltersChange({ ...filters, roleId: value === 'all' ? undefined : value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined).length;

  // Фільтруємо підрозділи - показуємо тільки групи вузла зв'язку
  const filteredUnits = units.filter(u => u.parentId === '3');

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('filters_search_placeholder')}
            className="pl-10"
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            {t('filters_clear')} ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{t('filters_title')}</span>
        </div>

        <Select value={filters.unitId || 'all'} onValueChange={handleUnitChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('filters_unit')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters_all_units')}</SelectItem>
            {filteredUnits.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.abbreviation} - {unit.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.positionId || 'all'} onValueChange={handlePositionChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('filters_position')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters_all_positions')}</SelectItem>
            {positions.map((position) => (
              <SelectItem key={position.id} value={position.id}>
                {position.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.roleId || 'all'} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('filters_role')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters_all_roles')}</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('filters_status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters_all_statuses')}</SelectItem>
            <SelectItem value="Служить">{t('filters_status_serving')}</SelectItem>
            <SelectItem value="Переведений">{t('filters_status_transferred')}</SelectItem>
            <SelectItem value="Звільнений">{t('filters_status_dismissed')}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.serviceType || 'all'} onValueChange={handleServiceTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('filters_service_type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters_all_service_types')}</SelectItem>
            <SelectItem value="Контракт">{t('filters_service_contract')}</SelectItem>
            <SelectItem value="Мобілізований">{t('filters_service_mobilized')}</SelectItem>
          </SelectContent>
        </Select>

        {actionSlot && (
          <div className="ml-auto">
            {actionSlot}
          </div>
        )}
      </div>

      {/* Active Filters Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.unitId && (
            <Badge variant="secondary">
              {t('filters_unit')}: {units.find(u => u.id === filters.unitId)?.abbreviation}
              <button
                onClick={() => handleUnitChange('all')}
                className="ml-2 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.positionId && (
            <Badge variant="secondary">
              {t('filters_position')}: {positions.find(p => p.id === filters.positionId)?.name}
              <button
                onClick={() => handlePositionChange('all')}
                className="ml-2 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.roleId && (
            <Badge variant="secondary">
              {t('filters_role')}: {roles.find(r => r.id === filters.roleId)?.name}
              <button
                onClick={() => handleRoleChange('all')}
                className="ml-2 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary">
              {t('filters_status')}: {
                filters.status === 'Служить' ? t('filters_status_serving') :
                  filters.status === 'Переведений' ? t('filters_status_transferred') :
                    filters.status === 'Звільнений' ? t('filters_status_dismissed') :
                      filters.status
              }
              <button
                onClick={() => handleStatusChange('all')}
                className="ml-2 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.serviceType && (
            <Badge variant="secondary">
              {t('filters_service_type')}: {
                filters.serviceType === 'Контракт' ? t('filters_service_contract') :
                  filters.serviceType === 'Мобілізований' ? t('filters_service_mobilized') :
                    filters.serviceType
              }
              <button
                onClick={() => handleServiceTypeChange('all')}
                className="ml-2 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}