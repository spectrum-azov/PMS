import { Check, AlertCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { useLanguage } from '../../context/LanguageContext';
import { useDictionaries } from '../../context/DictionariesContext';
import { ImportRow } from '../../hooks/useImportPersonnel';
import { Person } from '../../types/personnel';

interface ImportPersonnelTableRowProps {
    row: ImportRow;
    toggleRowSelection: (id: string) => void;
    updateRowField: (id: string, field: keyof Person, value: string) => void;
}

export function ImportPersonnelTableRow({ row, toggleRowSelection, updateRowField }: ImportPersonnelTableRowProps) {
    const { t } = useLanguage();
    const { units, positions, ranks } = useDictionaries();

    return (
        <tr className={`border-b border-border ${!row._isValid ? 'bg-destructive/10 hover:bg-destructive/20' : 'hover:bg-muted/30'}`}>
            <td className="p-2 text-center sticky left-0 bg-background z-10 border-r border-border shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
                <input
                    type="checkbox"
                    checked={row._selected}
                    onChange={() => toggleRowSelection(row._id)}
                />
            </td>
            <td className="p-2 text-center sticky left-10 bg-background z-10 border-r border-border shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
                {row._isValid ? (
                    <Check className="w-5 h-5 text-green-500 inline" />
                ) : (
                    <span title={(() => {
                        const dupErrors = row._errors.filter(e => e.includes(t('import_duplicate') || 'Дублікат'));
                        const missingFields = row._errors.filter(e => !e.includes(t('import_duplicate') || 'Дублікат'));
                        const parts = [];
                        if (missingFields.length > 0) {
                            parts.push(`${t('import_missing')} ${missingFields.join(', ')}`);
                        }
                        if (dupErrors.length > 0) {
                            parts.push(dupErrors.join(' | '));
                        }
                        return parts.join(' | ');
                    })()}>
                        <AlertCircle className="w-5 h-5 text-destructive inline" />
                    </span>
                )}
            </td>
            {/* Callsign */}
            <td className="p-2">
                <Input
                    value={row.callsign || ''}
                    onChange={e => updateRowField(row._id, 'callsign', e.target.value)}
                    className={`h-8 min-w-[90px] ${row._errors.includes('callsign') ? 'border-destructive' : ''}`}
                />
            </td>
            {/* Full Name */}
            <td className="p-2">
                <Input
                    value={row.fullName || ''}
                    onChange={e => updateRowField(row._id, 'fullName', e.target.value)}
                    className={`h-8 min-w-[150px] ${row._errors.includes('fullName') ? 'border-destructive' : ''}`}
                />
            </td>
            {/* Rank */}
            <td className="p-2">
                <select
                    value={row.rank || ''}
                    onChange={e => updateRowField(row._id, 'rank', e.target.value)}
                    className={`flex h-8 w-full min-w-[110px] rounded-md border border-input bg-background px-2 py-1 text-sm ${row._errors.includes('rank') ? 'border-destructive' : ''}`}
                >
                    <option value="">{t('import_select_rank')}</option>
                    {ranks.map((r) => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                </select>
            </td>
            {/* Birth Date */}
            <td className="p-2">
                <Input
                    type="date"
                    value={row.birthDate || ''}
                    onChange={e => updateRowField(row._id, 'birthDate', e.target.value)}
                    className={`h-8 min-w-[120px] ${row._errors.includes('birthDate') ? 'border-destructive' : ''}`}
                />
            </td>
            {/* Service Type */}
            <td className="p-2">
                <select
                    value={row.serviceType || ''}
                    onChange={e => updateRowField(row._id, 'serviceType', e.target.value)}
                    className={`flex h-8 w-full min-w-[120px] rounded-md border border-input bg-background px-2 py-1 text-sm ${row._errors.includes('serviceType') ? 'border-destructive' : ''}`}
                >
                    <option value="">{t('import_select_service_type')}</option>
                    <option value="Контракт">{t('filters_service_contract')}</option>
                    <option value="Мобілізований">{t('filters_service_mobilized')}</option>
                </select>
            </td>
            {/* Tag Number */}
            <td className="p-2">
                <Input
                    value={row.tagNumber || ''}
                    onChange={e => updateRowField(row._id, 'tagNumber', e.target.value)}
                    className="h-8 min-w-[80px]"
                />
            </td>
            {/* Unit */}
            <td className="p-2">
                <select
                    value={row.unitId || ''}
                    onChange={e => updateRowField(row._id, 'unitId', e.target.value)}
                    className={`flex h-8 min-w-[140px] rounded-md border border-input bg-background px-2 py-1 text-sm ${row._errors.includes('unitId') ? 'border-destructive' : ''}`}
                >
                    <option value="">{t('import_select_unit')}</option>
                    {units.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                </select>
            </td>
            {/* Position */}
            <td className="p-2">
                <select
                    value={row.positionId || ''}
                    onChange={e => updateRowField(row._id, 'positionId', e.target.value)}
                    className={`flex h-8 min-w-[140px] rounded-md border border-input bg-background px-2 py-1 text-sm ${row._errors.includes('positionId') ? 'border-destructive' : ''}`}
                >
                    <option value="">{t('import_select_pos')}</option>
                    {positions.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </td>
            {/* Status */}
            <td className="p-2">
                <select
                    value={row.status || ''}
                    onChange={e => updateRowField(row._id, 'status', e.target.value)}
                    className={`flex h-8 w-full min-w-[110px] rounded-md border border-input bg-background px-2 py-1 text-sm ${row._errors.includes('status') ? 'border-destructive' : ''}`}
                >
                    <option value="">{t('import_select_status')}</option>
                    <option value="Служить">{t('filters_status_serving')}</option>
                    <option value="Переведений">{t('filters_status_transferred')}</option>
                    <option value="Звільнений">{t('filters_status_dismissed')}</option>
                </select>
            </td>
            {/* Military ID */}
            <td className="p-2">
                <Input
                    value={row.militaryId || ''}
                    onChange={e => updateRowField(row._id, 'militaryId', e.target.value)}
                    className="h-8 min-w-[120px]"
                />
            </td>
            {/* Passport */}
            <td className="p-2">
                <Input
                    value={row.passport || ''}
                    onChange={e => updateRowField(row._id, 'passport', e.target.value)}
                    className="h-8 min-w-[100px]"
                />
            </td>
            {/* Tax ID */}
            <td className="p-2">
                <Input
                    value={row.taxId || ''}
                    onChange={e => updateRowField(row._id, 'taxId', e.target.value)}
                    className="h-8 min-w-[90px]"
                />
            </td>
            {/* Phone */}
            <td className="p-2">
                <Input
                    value={row.phone || ''}
                    onChange={e => updateRowField(row._id, 'phone', e.target.value)}
                    className={`h-8 min-w-[130px] ${row._errors.includes('phone') ? 'border-destructive' : ''}`}
                />
            </td>
            {/* Address */}
            <td className="p-2">
                <Input
                    value={row.address || ''}
                    onChange={e => updateRowField(row._id, 'address', e.target.value)}
                    className="h-8 min-w-[140px]"
                />
            </td>
            {/* Registration Address */}
            <td className="p-2">
                <Input
                    value={row.registrationAddress || ''}
                    onChange={e => updateRowField(row._id, 'registrationAddress', e.target.value)}
                    className="h-8 min-w-[140px]"
                />
            </td>
            {/* Citizenship */}
            <td className="p-2">
                <Input
                    value={row.citizenship || ''}
                    onChange={e => updateRowField(row._id, 'citizenship', e.target.value)}
                    className="h-8 min-w-[100px]"
                />
            </td>
            {/* Blood Type */}
            <td className="p-2">
                <Input
                    value={row.bloodType || ''}
                    onChange={e => updateRowField(row._id, 'bloodType', e.target.value)}
                    className="h-8 min-w-[100px]"
                />
            </td>
        </tr>
    );
}
