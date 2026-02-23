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

interface PersonnelFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function PersonnelFilters({ filters, onFiltersChange }: PersonnelFiltersProps) {
  const { units, positions, roles } = useDictionaries();

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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Пошук по позивному, ПІБ, телефону або військовому посвідченню..."
            className="pl-10"
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Очистити ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Фільтри:</span>
        </div>

        <Select value={filters.unitId || 'all'} onValueChange={handleUnitChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Підрозділ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі підрозділи</SelectItem>
            {filteredUnits.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.abbreviation} - {unit.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.positionId || 'all'} onValueChange={handlePositionChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Посада" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі посади</SelectItem>
            {positions.map((position) => (
              <SelectItem key={position.id} value={position.id}>
                {position.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.roleId || 'all'} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Роль" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі ролі</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі статуси</SelectItem>
            <SelectItem value="Служить">Служить</SelectItem>
            <SelectItem value="Переведений">Переведений</SelectItem>
            <SelectItem value="Звільнений">Звільнений</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.serviceType || 'all'} onValueChange={handleServiceTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Вид служби" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі види</SelectItem>
            <SelectItem value="Контракт">Контракт</SelectItem>
            <SelectItem value="Мобілізований">Мобілізований</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.unitId && (
            <Badge variant="secondary">
              Підрозділ: {units.find(u => u.id === filters.unitId)?.abbreviation}
              <button
                onClick={() => handleUnitChange('all')}
                className="ml-2 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.positionId && (
            <Badge variant="secondary">
              Посада: {positions.find(p => p.id === filters.positionId)?.name}
              <button
                onClick={() => handlePositionChange('all')}
                className="ml-2 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.roleId && (
            <Badge variant="secondary">
              Роль: {roles.find(r => r.id === filters.roleId)?.name}
              <button
                onClick={() => handleRoleChange('all')}
                className="ml-2 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary">
              Статус: {filters.status}
              <button
                onClick={() => handleStatusChange('all')}
                className="ml-2 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.serviceType && (
            <Badge variant="secondary">
              Вид служби: {filters.serviceType}
              <button
                onClick={() => handleServiceTypeChange('all')}
                className="ml-2 hover:text-red-600"
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