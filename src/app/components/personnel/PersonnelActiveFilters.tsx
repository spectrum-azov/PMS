import { X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { PersonnelFilters as Filters } from '../../types/personnel';
import { useLanguage } from '../../context/LanguageContext';
import { useDictionaries } from '../../context/DictionariesContext';

interface PersonnelActiveFiltersProps {
    filters: Filters;
    onClearFilter: (key: keyof Filters) => void;
}

export function PersonnelActiveFilters({ filters, onClearFilter }: PersonnelActiveFiltersProps) {
    const { t } = useLanguage();
    const { units, positions, roles } = useDictionaries();

    const activeFiltersCount = Object.values(filters).filter(v => v !== undefined).length;

    if (activeFiltersCount === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {filters.unitId && (
                <Badge variant="secondary">
                    {t('filters_unit')}: {units.find(u => u.id === filters.unitId)?.abbreviation}
                    <button
                        onClick={() => onClearFilter('unitId')}
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
                        onClick={() => onClearFilter('positionId')}
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
                        onClick={() => onClearFilter('roleId')}
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
                        onClick={() => onClearFilter('status')}
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
                        onClick={() => onClearFilter('serviceType')}
                        className="ml-2 hover:text-destructive"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </Badge>
            )}
        </div>
    );
}
