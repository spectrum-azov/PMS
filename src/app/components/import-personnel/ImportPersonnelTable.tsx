import { useLanguage } from '../../context/LanguageContext';
import { useDictionaries } from '../../context/DictionariesContext';
import { ImportRow } from '../../hooks/useImportPersonnel';
import { Person } from '../../types/personnel';
import { GenericEditableTable, EditableColumn } from '../ui/GenericEditableTable';

interface ImportPersonnelTableProps {
    data: ImportRow[];
    selectedCount: number;
    toggleAll: (checked: boolean) => void;
    toggleRowSelection: (id: string) => void;
    updateRowField: (id: string, field: keyof Person, value: string) => void;
}

export function ImportPersonnelTable({
    data,
    selectedCount,
    toggleAll,
    toggleRowSelection,
    updateRowField
}: ImportPersonnelTableProps) {
    const { t } = useLanguage();
    const { units, positions, ranks } = useDictionaries();

    const columns: EditableColumn<ImportRow>[] = [
        { id: 'callsign', header: t('import_col_callsign'), type: 'text', minWidth: '90px' },
        { id: 'fullName', header: t('import_col_fullname'), type: 'text', minWidth: '150px' },
        {
            id: 'rank',
            header: t('import_col_rank'),
            type: 'select',
            options: ranks.map(r => ({ value: r.name, label: r.name })),
            placeholder: t('import_select_rank'),
            minWidth: '110px'
        },
        { id: 'birthDate', header: t('import_col_dob'), type: 'date', minWidth: '120px' },
        {
            id: 'serviceType',
            header: t('import_col_service_type'),
            type: 'select',
            options: [
                { value: 'Контракт', label: t('filters_service_contract') },
                { value: 'Мобілізований', label: t('filters_service_mobilized') }
            ],
            placeholder: t('import_select_service_type'),
            minWidth: '120px'
        },
        { id: 'tagNumber', header: t('import_col_tag_number'), type: 'text', minWidth: '80px' },
        {
            id: 'unitId',
            header: t('import_col_unit'),
            type: 'select',
            options: units.map(u => ({ value: u.id, label: u.name })),
            placeholder: t('import_select_unit'),
            minWidth: '140px'
        },
        {
            id: 'positionId',
            header: t('import_col_position'),
            type: 'select',
            options: positions.map(p => ({ value: p.id, label: p.name })),
            placeholder: t('import_select_pos'),
            minWidth: '140px'
        },
        {
            id: 'status',
            header: t('import_col_service_status'),
            type: 'select',
            options: [
                { value: 'Служить', label: t('filters_status_serving') },
                { value: 'Переведений', label: t('filters_status_transferred') },
                { value: 'Звільнений', label: t('filters_status_dismissed') }
            ],
            placeholder: t('import_select_status'),
            minWidth: '110px'
        },
        { id: 'militaryId', header: t('import_col_military_id'), type: 'text', minWidth: '120px' },
        { id: 'passport', header: t('import_col_passport'), type: 'text', minWidth: '100px' },
        { id: 'taxId', header: t('import_col_tax_id'), type: 'text', minWidth: '90px' },
        { id: 'phone', header: t('import_col_phone'), type: 'text', minWidth: '130px' },
        { id: 'address', header: t('import_col_address'), type: 'text', minWidth: '140px' },
        { id: 'registrationAddress', header: t('import_col_reg_address'), type: 'text', minWidth: '140px' },
        { id: 'citizenship', header: t('import_col_citizenship'), type: 'text', minWidth: '100px' },
        { id: 'bloodType', header: t('import_col_blood_type'), type: 'text', minWidth: '100px' }
    ];

    const isRowValid = (row: ImportRow) => row._isValid;
    const isRowSelected = (row: ImportRow) => row._selected;
    const getRowError = (row: ImportRow, field: keyof ImportRow) => row._errors.includes(String(field));
    const getRowErrorTooltip = (row: ImportRow) => {
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
    };

    return (
        <GenericEditableTable
            data={data}
            columns={columns}
            idField="_id"
            selectedCount={selectedCount}
            toggleAll={toggleAll}
            toggleRowSelection={toggleRowSelection}
            isRowSelected={isRowSelected}
            updateRowField={updateRowField as any}
            isRowValid={isRowValid}
            getRowError={getRowError}
            getRowErrorTooltip={getRowErrorTooltip}
            validStatusHeader={t('import_col_valid')}
        />
    );
}
