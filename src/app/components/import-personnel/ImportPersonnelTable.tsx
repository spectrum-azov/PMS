import { Card, CardContent } from '../ui/card';
import { useLanguage } from '../../context/LanguageContext';
import { ImportRow } from '../../hooks/useImportPersonnel';
import { Person } from '../../types/personnel';
import { ImportPersonnelTableRow } from './ImportPersonnelTableRow';

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

    return (
        <Card>
            <CardContent className="p-0">
                <div className="w-full overflow-x-auto pb-4">
                    <table className="w-full text-sm text-left border-collapse min-w-max">
                        <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                            <tr>
                                <th className="p-2 w-10 text-center sticky left-0 bg-muted/50 z-10 border-r border-border">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => toggleAll(e.target.checked)}
                                        checked={data.length > 0 && selectedCount === data.length}
                                    />
                                </th>
                                <th className="p-2 w-10 sticky left-10 bg-muted/50 z-10 border-r border-border">{t('import_col_valid')}</th>
                                <th className="p-2 min-w-[100px]">{t('import_col_callsign')}</th>
                                <th className="p-2 min-w-[180px]">{t('import_col_fullname')}</th>
                                <th className="p-2 min-w-[130px]">{t('import_col_rank')}</th>
                                <th className="p-2 min-w-[130px]">{t('import_col_dob')}</th>
                                <th className="p-2 min-w-[140px]">{t('import_col_service_type')}</th>
                                <th className="p-2 min-w-[100px]">{t('import_col_tag_number')}</th>
                                <th className="p-2 min-w-[180px]">{t('import_col_unit')}</th>
                                <th className="p-2 min-w-[180px]">{t('import_col_position')}</th>
                                <th className="p-2 min-w-[120px]">{t('import_col_service_status')}</th>
                                <th className="p-2 min-w-[140px]">{t('import_col_military_id')}</th>
                                <th className="p-2 min-w-[120px]">{t('import_col_passport')}</th>
                                <th className="p-2 min-w-[100px]">{t('import_col_tax_id')}</th>
                                <th className="p-2 min-w-[140px]">{t('import_col_phone')}</th>
                                <th className="p-2 min-w-[160px]">{t('import_col_address')}</th>
                                <th className="p-2 min-w-[160px]">{t('import_col_reg_address')}</th>
                                <th className="p-2 min-w-[120px]">{t('import_col_citizenship')}</th>
                                <th className="p-2 min-w-[120px]">{t('import_col_blood_type')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(row => (
                                <ImportPersonnelTableRow
                                    key={row._id}
                                    row={row}
                                    toggleRowSelection={toggleRowSelection}
                                    updateRowField={updateRowField}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
