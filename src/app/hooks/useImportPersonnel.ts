import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { usePersonnel } from '../context/PersonnelContext';
import { useDictionaries } from '../context/DictionariesContext';
import { organizationalUnits } from '../data/mockData';
import { Person, ServiceStatus, ServiceType } from '../types/personnel';
import { checkDuplicatesInDb } from '../api/personnelApi';
import Papa from 'papaparse';
import { toast } from 'sonner';

export interface ImportRow extends Partial<Person> {
    _id: string; // internal id for keying
    _selected: boolean;
    _isValid: boolean;
    _errors: string[];
    [key: string]: any; // allowing generic access
}

// Required fields for a Person to be created via API
const requiredFields = ['callsign', 'fullName', 'rank', 'birthDate', 'serviceType', 'unitId', 'positionId', 'status', 'phone'];

function cleanString(str: string): string {
    if (!str) return '';
    return str.toLowerCase().replace(/[\s\'\\]+/g, '');
}

export function useImportPersonnel() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { addPerson } = usePersonnel();
    const { positions, ranks } = useDictionaries();

    const [data, setData] = useState<ImportRow[]>([]);
    const [isImporting, setIsImporting] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [dbChecked, setDbChecked] = useState(false);

    const validateRow = (row: ImportRow): ImportRow => {
        const errors: string[] = [];
        requiredFields.forEach(field => {
            if (!row[field]) {
                errors.push(field);
            }
        });

        return {
            ...row,
            _isValid: errors.length === 0,
            _errors: errors
        };
    };

    const checkDuplicates = (rows: ImportRow[]): ImportRow[] => {
        const seenCallsign = new Set<string>();
        const seenMilitaryId = new Set<string>();
        const seenPassport = new Set<string>();
        const seenTaxId = new Set<string>();

        return rows.map(r => {
            const row = validateRow({ ...r });
            let isDuplicate = false;
            const duplicateFields: string[] = [];

            if (row.callsign) {
                const cs = row.callsign.toLowerCase();
                if (seenCallsign.has(cs)) {
                    isDuplicate = true;
                    duplicateFields.push(t('import_duplicate_callsign') || 'Позивний');
                } else {
                    seenCallsign.add(cs);
                }
            }

            if (row.militaryId) {
                if (seenMilitaryId.has(row.militaryId)) {
                    isDuplicate = true;
                    duplicateFields.push(t('import_duplicate_military') || 'Військовий квиток');
                } else {
                    seenMilitaryId.add(row.militaryId);
                }
            }

            if (row.passport) {
                if (seenPassport.has(row.passport)) {
                    isDuplicate = true;
                    duplicateFields.push(t('import_duplicate_passport') || 'Паспорт');
                } else {
                    seenPassport.add(row.passport);
                }
            }

            if (row.taxId) {
                if (seenTaxId.has(row.taxId)) {
                    isDuplicate = true;
                    duplicateFields.push(t('import_duplicate_tax') || 'ІПН');
                } else {
                    seenTaxId.add(row.taxId);
                }
            }

            if (isDuplicate) {
                row._isValid = false;
                row._selected = false; // Deselect duplicates by default
                row._errors.push(`${t('import_duplicate') || 'Дублікат'}: ${duplicateFields.join(', ')}`);
            }

            return row;
        });
    };

    const handleFileUpload = (file?: File) => {
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsedRows = (results.data as Record<string, string>[]).map((row, index) => {
                    const getVal = (keys: string[]) => {
                        for (const key of keys) {
                            if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
                                return row[key].toString().trim();
                            }
                        }
                        return '';
                    };

                    const rawCallsign = getVal(['callsign', 'Позивний', 'позивний', 'Callsign']);
                    const rawFullName = getVal(['fullName', 'fullname', 'ПІБ', 'Піб', 'ПіБ', 'Full Name', 'Fullname', 'Name', 'Ім\'я']);
                    const rawRank = getVal(['rank', 'Звання', 'звання', 'Rank']);
                    const rawBirthDate = getVal(['birthDate', 'birthdate', 'Дата народження', 'дата народження', 'DOB', 'dob', 'Дата нар.']);
                    const rawUnit = getVal(['unit', 'unitId', 'Підрозділ', 'підрозділ', 'Unit', 'Організаційний підрозділ']);
                    const rawPosition = getVal(['position', 'positionId', 'Посада', 'посада', 'Position', 'Штатна посада']);
                    const rawPhone = getVal(['phone', 'Телефон', 'телефон', 'Phone', 'Номер']);
                    const rawStatus = getVal(['status', 'Статус', 'статус', 'Status']);
                    const rawServiceType = getVal(['serviceType', 'servicetype', 'Вид служби', 'вид служби', 'Service Type']);
                    const rawMilitaryId = getVal(['militaryId', 'military id', 'військовий квиток', 'в/к', 'Військовий квиток']);
                    const rawPassport = getVal(['passport', 'паспорт', 'Паспорт']);
                    const rawTaxId = getVal(['taxId', 'іпн', 'ІПН', 'tax id', 'Tax ID']);
                    const rawTagNumber = getVal(['tagNumber', 'tagnumber', 'жетон', 'Жетон', 'Номер жетона', 'Tag Number']);
                    const rawAddress = getVal(['address', 'адреса', 'Адреса', 'Місце проживання', 'Address']);
                    const rawRegAddress = getVal(['registrationAddress', 'registrationaddress', 'Адреса реєстрації', 'Місце реєстрації', 'Registration Address']);
                    const rawCitizenship = getVal(['citizenship', 'громадянство', 'Громадянство', 'Citizenship']);
                    const rawBloodType = getVal(['bloodType', 'bloodtype', 'Група крові', 'група крові', 'Blood Type']);

                    // Normalize matching values
                    let matchedUnit = '';
                    let matchedPosition = '';
                    let matchedRank = '';

                    // 1. Match Unit
                    if (rawUnit) {
                        const val = cleanString(rawUnit);
                        const found = organizationalUnits.find(u =>
                            cleanString(u.name) === val ||
                            (u.abbreviation && cleanString(u.abbreviation) === val) ||
                            cleanString(u.name).includes(val)
                        );
                        if (found) matchedUnit = found.id;
                    }

                    // 2. Match Position
                    if (rawPosition) {
                        const val = cleanString(rawPosition);
                        const found = positions.find(p =>
                            cleanString(p.name) === val ||
                            cleanString(p.name).includes(val) ||
                            val.includes(cleanString(p.name))
                        );
                        if (found) matchedPosition = found.id;
                    }

                    // 3. Match Rank
                    if (rawRank) {
                        const val = cleanString(rawRank);
                        const found = ranks.find(r =>
                            cleanString(r.name) === val ||
                            cleanString(r.name).includes(val) ||
                            val.includes(cleanString(r.name))
                        );
                        if (found) matchedRank = found.name;
                    }

                    // 4. Match Status
                    let matchedStatus = 'Служить';
                    if (rawStatus) {
                        const val = cleanString(rawStatus);
                        if (val.includes('переведен') || val.includes('transfer')) matchedStatus = 'Переведений';
                        else if (val.includes('звільнен') || val.includes('discharg') || val.includes('dismiss')) matchedStatus = 'Звільнений';
                    }

                    // 5. Match Service Type
                    let matchedServiceType = 'Контракт';
                    if (rawServiceType) {
                        const val = cleanString(rawServiceType);
                        if (val.includes('мобіліз') || val.includes('mobiliz')) matchedServiceType = 'Мобілізований';
                    }

                    const parsedRow: ImportRow = {
                        _id: `row-${index}-${Date.now()}`,
                        _selected: true,
                        _isValid: false,
                        _errors: [],
                        unitId: matchedUnit,
                        positionId: matchedPosition,
                        rank: matchedRank,
                        callsign: rawCallsign,
                        fullName: rawFullName,
                        birthDate: rawBirthDate,
                        serviceType: matchedServiceType as ServiceType,
                        status: matchedStatus as ServiceStatus,
                        phone: rawPhone,
                        militaryId: rawMilitaryId,
                        passport: rawPassport,
                        taxId: rawTaxId,
                        tagNumber: rawTagNumber,
                        address: rawAddress,
                        registrationAddress: rawRegAddress,
                        citizenship: rawCitizenship,
                        bloodType: rawBloodType,
                        roleIds: [],
                    };

                    return parsedRow;
                });

                setData(checkDuplicates(parsedRows as ImportRow[]));
                setDbChecked(false); // Reset DB check on new file upload
            },
            error: (error: Error) => {
                toast.error(`${t('import_err_parse')} ${error.message}`);
            }
        });

        // Reset input so the same file could be loaded again
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const updateRowField = (id: string, field: keyof Person, value: string) => {
        setData(prev => {
            const temp = prev.map(row => {
                if (row._id === id) {
                    return { ...row, [field]: value };
                }
                return row;
            });
            return checkDuplicates(temp);
        });
    };

    const toggleRowSelection = (id: string) => {
        setData(prev => prev.map(row =>
            row._id === id ? { ...row, _selected: !row._selected } : row
        ));
    };

    const toggleAll = (checked: boolean) => {
        setData(prev => prev.map(row => ({ ...row, _selected: checked })));
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
