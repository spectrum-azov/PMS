import { Search, Filter, X } from 'lucide-react';
import { useState, useDeferredValue, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { Person, PersonnelFilters as Filters } from '../../types/personnel';
import { useDictionaries } from '../../context/DictionariesContext';
import { useLanguage } from '../../context/LanguageContext';
import { PersonnelActiveFilters } from './PersonnelActiveFilters';

interface PersonnelFiltersProps {
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
    actionSlot?: React.ReactNode;
}

export function PersonnelFilters({ filters, onFiltersChange, actionSlot }: PersonnelFiltersProps) {
    const { units, positions, roles } = useDictionaries();
    const { t } = useLanguage();

    const [searchText, setSearchText] = useState(filters.search || '');
    const deferredSearchText = useDeferredValue(searchText);

    useEffect(() => {
        if (deferredSearchText !== (filters.search || '')) {
            onFiltersChange({ ...filters, search: deferredSearchText || undefined });
        }
    }, [deferredSearchText]);

    useEffect(() => {
        if (filters.search === undefined && searchText !== '') {
            setSearchText('');
        }
    }, [filters.search]);

    const handleSearchChange = (value: string) => {
        setSearchText(value);
    };

    const handleUnitChange = (value: string) => {
        onFiltersChange({ ...filters, unitId: value === 'all' ? undefined : value });
    };

    const handlePositionChange = (value: string) => {
        onFiltersChange({ ...filters, positionId: value === 'all' ? undefined : value });
    };

    const handleStatusChange = (value: string) => {
        onFiltersChange({ ...filters, status: value === 'all' ? undefined : value as Person['status'] });
    };

    const handleServiceTypeChange = (value: string) => {
        onFiltersChange({ ...filters, serviceType: value === 'all' ? undefined : value as Person['serviceType'] });
    };

    const handleClearFilter = (key: keyof Filters) => {
        onFiltersChange({ ...filters, [key]: undefined });
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
                        className="pl-12"
                        value={searchText}
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
                <PersonnelActiveFilters
                    filters={filters}
                    onClearFilter={handleClearFilter}
                />
            )}
        </div>
    );
}
