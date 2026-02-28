import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { usePersonnel } from '../context/PersonnelContext';
import { useDictionaries } from '../context/DictionariesContext';
import { organizationalUnits } from '../data/mockData';
import { Person, ServiceStatus, ServiceType } from '../types/personnel';
import { checkDuplicatesInDb } from '../api/personnelApi';
import { toast } from 'sonner';
import { useEditableTable } from './useEditableTable';
import { checkDuplicates, parsePersonnelCsv } from '../utils/importPersonnelUtils';

export interface ImportRow extends Partial<Person> {
    _id: string; // internal id for keying
    _selected: boolean;
    _isValid: boolean;
    _errors: string[];
    [key: string]: any; // allowing generic access
}



export function useImportPersonnel() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { addPerson } = usePersonnel();
    const { positions, ranks } = useDictionaries();

    const {
        data,
        setData,
        updateRowField: updateField,
        toggleRowSelection,
        toggleAll
    } = useEditableTable<ImportRow>({ initialData: [], idField: '_id', selectionField: '_selected' });

    const [isImporting, setIsImporting] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [dbChecked, setDbChecked] = useState(false);

    const handleFileUpload = (file?: File) => {
        if (!file) return;

        parsePersonnelCsv(
            file,
            { units: organizationalUnits, positions, ranks },
            t as any, // Cast t to match expected (key: string) => string
            (parsedData) => {
                setData(parsedData);
                setDbChecked(false); // Reset DB check on new file upload
            },
            (error) => {
                toast.error(`${t('import_err_parse')} ${error.message}`);
            }
        );

        // Reset input so the same file could be loaded again
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    const updateRowField = (id: string, field: keyof Person, value: string) => {
        // Use the generic updateField
        updateField(id, field, value);
        // We still need to run deduplication over the whole new dataset asynchronously
        // or by reading the latest state. The old logic checked duplicates inline.
        // Let's rely on the `updateField` and then trigger a duplicate check.
        setData(prev => checkDuplicates(prev, t as any));
    };

    const handleCheckDb = async () => {
        setIsChecking(true);
        const items = data.map(row => ({
            callsign: row.callsign || undefined,
            militaryId: row.militaryId || undefined,
            passport: row.passport || undefined,
            taxId: row.taxId || undefined,
        }));

        const result = await checkDuplicatesInDb(items);

        if (!result.success) {
            toast.error(result.message);
            setIsChecking(false);
            return;
        }

        setData(prev => {
            const updated = prev.map((row, idx) => {
                const check = result.data[idx];
                if (check && check.isDuplicate) {
                    const fieldLabels = check.matchedFields.map(f => {
                        if (f === 'callsign') return t('import_duplicate_callsign') || 'Позивний';
                        if (f === 'militaryId') return t('import_duplicate_military') || 'Військовий квиток';
                        if (f === 'passport') return t('import_duplicate_passport') || 'Паспорт';
                        return t('import_duplicate_tax') || 'ІПН';
                    });
                    return {
                        ...row,
                        _isValid: false,
                        _selected: false,
                        _errors: [
                            ...row._errors.filter(e => !e.includes(t('import_duplicate_db') || 'Дублікат (БД)')),
                            `${t('import_duplicate_db') || 'Дублікат (БД)'}: ${fieldLabels.join(', ')}`,
                        ],
                    };
                }
                return row;
            });
            return updated;
        });

        setDbChecked(true);
        setIsChecking(false);
        toast.success(t('import_db_checked'));
    };

    const handleImport = async () => {
        if (!dbChecked) {
            toast.error(t('import_check_db_required'));
            return;
        }
        setIsImporting(true);
        let successCount = 0;
        const toImport = data.filter(d => d._selected && d._isValid);

        if (toImport.length === 0) {
            toast.error(t('import_err_no_valid'));
            setIsImporting(false);
            return;
        }

        // Process one by one sequentially 
        for (const row of toImport) {
            const personToCreate = {
                callsign: row.callsign!,
                fullName: row.fullName!,
                rank: row.rank!,
                birthDate: row.birthDate!,
                serviceType: row.serviceType as ServiceType,
                unitId: row.unitId!,
                positionId: row.positionId!,
                status: row.status as ServiceStatus,
                phone: row.phone!,
                militaryId: row.militaryId || undefined,
                passport: row.passport || undefined,
                taxId: row.taxId || undefined,
                tagNumber: row.tagNumber || undefined,
                address: row.address || undefined,
                registrationAddress: row.registrationAddress || undefined,
                citizenship: row.citizenship || undefined,
                bloodType: row.bloodType || undefined,
                roleIds: row.roleIds || [],
            } as Person;

            // Attempt creation
            const ok = await addPerson(personToCreate);
            if (ok) successCount++;
        }

        setIsImporting(false);

        if (successCount === toImport.length) {
            toast.success(`${t('import_success')} ${successCount} ${t('import_success_pl')}`);
            navigate('/personnel');
        } else {
            toast.error(`${t('import_partial')} ${successCount} ${t('import_partial_out_of')} ${toImport.length} ${t('import_partial_selected')}`);
            // Remove successful ones and leave failed/invalid
            setData(prev => prev.filter(r => r._isValid === false || !r._selected));
        }
    };

    return {
        data,
        isImporting,
        isChecking,
        dbChecked,
        fileInputRef,
        handleFileUpload,
        updateRowField,
        toggleRowSelection,
        toggleAll,
        handleCheckDb,
        handleImport
    };
}
