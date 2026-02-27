import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { usePersonnel } from '../context/PersonnelContext';
import { useDictionaries } from '../context/DictionariesContext';
import { Person, ServiceStatus, ServiceType } from '../types/personnel';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Upload, ChevronLeft, Check, AlertCircle, Save } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

// Required fields for a Person to be created via API
const requiredFields = ['callsign', 'fullName', 'rank', 'birthDate', 'serviceType', 'unitId', 'positionId', 'status', 'phone'];

interface ImportRow extends Partial<Person> {
    _id: string; // internal id for keying
    _selected: boolean;
    _isValid: boolean;
    _errors: string[];
    [key: string]: any; // allowing generic access
}

function cleanString(str: string): string {
    if (!str) return '';
    return str.toLowerCase().replace(/[\s\'\\]+/g, '');
}

export function ImportPersonnel() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { addPerson, personnel } = usePersonnel();
    const { units, positions, ranks, roles } = useDictionaries();

    const [data, setData] = useState<ImportRow[]>([]);
    const [isImporting, setIsImporting] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsedRows = results.data.map((row: any, index) => {
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

                    // Normalize matching values
                    let matchedUnit = '';
                    let matchedPosition = '';
                    let matchedRank = '';

                    // 1. Match Unit
                    if (rawUnit) {
                        const val = cleanString(rawUnit);
                        const found = units.find(u =>
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
                        roleIds: [],
                    };

                    return parsedRow;
                });

                setData(checkDuplicates(parsedRows));
            },
            error: (error) => {
                toast.error(`${t('import_err_parse')} ${error.message}`);
            }
        });

        // Reset input so the same file could be loaded again
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

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
        const seenMilitaryId = new Set<string>();
        const seenPassport = new Set<string>();
        const seenTaxId = new Set<string>();

        return rows.map(r => {
            const row = validateRow({ ...r });
            let isDuplicate = false;
            const duplicateFields: string[] = [];

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

    const updateRowField = (id: string, field: keyof Person, value: any) => {
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

    const handleImport = async () => {
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

    const selectedCount = data.filter(d => d._selected).length;
    const validSelectedCount = data.filter(d => d._selected && d._isValid).length;

    return (
        <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/personnel')}>
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-3xl font-semibold text-foreground">{t('import_title')}</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('import_upload_title')}</CardTitle>
                    <CardDescription>{t('import_upload_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <input
                            type="file"
                            accept=".csv"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                        <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                            <Upload className="w-4 h-4 mr-2" /> {t('import_select_file')}
                        </Button>

                        {data.length > 0 && (
                            <Button onClick={handleImport} disabled={validSelectedCount === 0 || isImporting} className="ml-auto">
                                <Save className="w-4 h-4 mr-2" /> {t('import_btn')} ({validSelectedCount} {t('import_valid')})
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {data.length > 0 && (
                <Card>
                    <CardContent className="p-0">
                        <div className="w-full overflow-x-auto pb-4">
                            <table className="w-full text-sm text-left border-collapse whitespace-nowrap min-w-max">
                                <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                                    <tr>
                                        <th className="p-3 w-10 text-center sticky left-0 bg-muted/50 z-10 border-r border-border">
                                            <input
                                                type="checkbox"
                                                onChange={(e) => toggleAll(e.target.checked)}
                                                checked={selectedCount === data.length}
                                            />
                                        </th>
                                        <th className="p-3 w-10 sticky left-10 bg-muted/50 z-10 border-r border-border">{t('import_col_valid')}</th>
                                        <th className="p-3 min-w-[120px]">{t('import_col_callsign')}</th>
                                        <th className="p-3 min-w-[200px]">{t('import_col_fullname')}</th>
                                        <th className="p-3 min-w-[150px]">{t('import_col_rank')}</th>
                                        <th className="p-3 min-w-[160px]">{t('import_col_service_type')}</th>
                                        <th className="p-3 min-w-[140px]">{t('import_col_service_status')}</th>
                                        <th className="p-3 min-w-[160px]">{t('import_col_dob')}</th>
                                        <th className="p-3 min-w-[200px]">{t('import_col_unit')}</th>
                                        <th className="p-3 min-w-[200px]">{t('import_col_position')}</th>
                                        <th className="p-3 min-w-[160px]">{t('import_col_phone')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(row => (
                                        <tr key={row._id} className={`border-b border-border ${!row._isValid ? 'bg-destructive/10 hover:bg-destructive/20' : 'hover:bg-muted/30'}`}>
                                            <td className="p-3 text-center sticky left-0 bg-background z-10 border-r border-border shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
                                                <input
                                                    type="checkbox"
                                                    checked={row._selected}
                                                    onChange={() => toggleRowSelection(row._id)}
                                                />
                                            </td>
                                            <td className="p-3 text-center sticky left-10 bg-background z-10 border-r border-border shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
                                                {row._isValid ? (
                                                    <Check className="w-5 h-5 text-green-500 inline" />
                                                ) : (
                                                    <span title={`${t('import_missing')} ${row._errors.join(', ')}`}>
                                                        <AlertCircle className="w-5 h-5 text-destructive inline" />
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <Input
                                                    value={row.callsign || ''}
                                                    onChange={e => updateRowField(row._id, 'callsign', e.target.value)}
                                                    className={`h-8 min-w-[100px] ${row._errors.includes('callsign') ? 'border-destructive' : ''}`}
                                                />
                                            </td>
                                            <td className="p-3">
                                                <Input
                                                    value={row.fullName || ''}
                                                    onChange={e => updateRowField(row._id, 'fullName', e.target.value)}
                                                    className={`h-8 min-w-[150px] ${row._errors.includes('fullName') ? 'border-destructive' : ''}`}
                                                />
                                            </td>
                                            <td className="p-3">
                                                <select
                                                    value={row.rank || ''}
                                                    onChange={e => updateRowField(row._id, 'rank', e.target.value)}
                                                    className={`flex h-8 w-full min-w-[130px] rounded-md border border-input bg-background px-3 py-1 text-sm ${row._errors.includes('rank') ? 'border-destructive' : ''}`}
                                                >
                                                    <option value="">{t('import_select_rank')}</option>
                                                    {ranks.map(r => (
                                                        <option key={r.id} value={r.name}>{r.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-3">
                                                <select
                                                    value={row.serviceType || ''}
                                                    onChange={e => updateRowField(row._id, 'serviceType', e.target.value)}
                                                    className={`flex h-8 w-full min-w-[130px] rounded-md border border-input bg-background px-3 py-1 text-sm ${row._errors.includes('serviceType') ? 'border-destructive' : ''}`}
                                                >
                                                    <option value="">{t('import_select_service_type')}</option>
                                                    <option value="Контракт">{t('filters_service_contract')}</option>
                                                    <option value="Мобілізований">{t('filters_service_mobilized')}</option>
                                                </select>
                                            </td>
                                            <td className="p-3">
                                                <select
                                                    value={row.status || ''}
                                                    onChange={e => updateRowField(row._id, 'status', e.target.value)}
                                                    className={`flex h-8 w-full min-w-[130px] rounded-md border border-input bg-background px-3 py-1 text-sm ${row._errors.includes('status') ? 'border-destructive' : ''}`}
                                                >
                                                    <option value="">{t('import_select_status')}</option>
                                                    <option value="Служить">{t('filters_status_serving')}</option>
                                                    <option value="Переведений">{t('filters_status_transferred')}</option>
                                                    <option value="Звільнений">{t('filters_status_dismissed')}</option>
                                                </select>
                                            </td>
                                            <td className="p-3">
                                                <Input
                                                    type="date"
                                                    value={row.birthDate || ''}
                                                    onChange={e => updateRowField(row._id, 'birthDate', e.target.value)}
                                                    className={`h-8 min-w-[130px] ${row._errors.includes('birthDate') ? 'border-destructive' : ''}`}
                                                />
                                            </td>
                                            <td className="p-3">
                                                <select
                                                    value={row.unitId || ''}
                                                    onChange={e => updateRowField(row._id, 'unitId', e.target.value)}
                                                    className={`flex h-8 min-w-[150px] rounded-md border border-input bg-background px-3 py-1 text-sm ${row._errors.includes('unitId') ? 'border-destructive' : ''}`}
                                                >
                                                    <option value="">{t('import_select_unit')}</option>
                                                    {units.map(u => (
                                                        <option key={u.id} value={u.id}>{u.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-3">
                                                <select
                                                    value={row.positionId || ''}
                                                    onChange={e => updateRowField(row._id, 'positionId', e.target.value)}
                                                    className={`flex h-8 min-w-[150px] rounded-md border border-input bg-background px-3 py-1 text-sm ${row._errors.includes('positionId') ? 'border-destructive' : ''}`}
                                                >
                                                    <option value="">{t('import_select_pos')}</option>
                                                    {positions.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-3">
                                                <Input
                                                    value={row.phone || ''}
                                                    onChange={e => updateRowField(row._id, 'phone', e.target.value)}
                                                    className={`h-8 min-w-[150px] ${row._errors.includes('phone') ? 'border-destructive' : ''}`}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
