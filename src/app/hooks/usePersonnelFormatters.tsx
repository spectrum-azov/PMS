import { useDictionaries } from '../context/DictionariesContext';
import { useLanguage } from '../context/LanguageContext';
import { Badge } from '../components/ui/badge';


export function usePersonnelFormatters() {
    const { units, positions, roles } = useDictionaries();
    const { t } = useLanguage();

    const getUnitName = (unitId: string) => {
        const unit = units.find(u => u.id === unitId);
        return unit?.name || t('common_unknown');
    };

    const getPositionName = (positionId: string) => {
        const position = positions.find(p => p.id === positionId);
        return position?.name || t('common_unknown');
    };

    const getRoleName = (roleId: string) => {
        const role = roles.find(r => r.id === roleId);
        return role?.name || t('common_unknown');
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            'Служить': 'default',
            'Переведений': 'secondary',
            'Звільнений': 'destructive',
        };
        const translatedStatus = (() => {
            if (status === 'Служить') return t('filters_status_serving');
            if (status === 'Переведений') return t('filters_status_transferred');
            if (status === 'Звільнений') return t('filters_status_dismissed');
            return status;
        })();
        return <Badge variant={variants[status] || 'outline'}>{translatedStatus}</Badge>;
    };

    const getServiceTypeBadge = (type: string) => {
        const translatedType = (() => {
            if (type === 'Контракт') return t('filters_service_contract');
            if (type === 'Мобілізований') return t('filters_service_mobilized');
            return type;
        })();
        return (
            <Badge variant={type === 'Контракт' ? 'default' : 'secondary'}>
                {translatedType}
            </Badge>
        );
    };

    return { getUnitName, getPositionName, getRoleName, getStatusBadge, getServiceTypeBadge };
}
