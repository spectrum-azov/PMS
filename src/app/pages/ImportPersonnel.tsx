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
    return str.toLowerCase().replace(/\s+/g, '');
}

export function ImportPersonnel() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { addPerson } = usePersonnel();
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
                    // Normalize matching values
                    let matchedUnit = '';
                    let matchedPosition = '';
                    let matchedRank = '';

                    // 1. Match Unit
                    if (row.unit || row.unitId) {
                        const val = cleanString(row.unit || row.unitId);
                        const found = units.find(u => cleanString(u.name) === val || (u.abbreviation && cleanString(u.abbreviation) === val));
                        if (found) matchedUnit = found.id;
                    }

                    // 2. Match Position
                    if (row.position || row.positionId) {
                        const val = cleanString(row.position || row.positionId);
                        const found = positions.find(p => cleanString(p.name) === val);
                        if (found) matchedPosition = found.id;
                    }

                    // 3. Match Rank
                    if (row.rank) {
                        const val = cleanString(row.rank);
                        const found = ranks.find(r => cleanString(r.name) === val);
                        // Assign the matched name or keep original to let user correct manually
                        matchedRank = found ? found.name : row.rank;
                    }

                    const parsedRow: ImportRow = {
                        _id: `row-${index}-${Date.now()}`,
                        _selected: true,
                        _isValid: false,
                        _errors: [],
                        ...row,
                        unitId: matchedUnit,
                        positionId: matchedPosition,
                        rank: matchedRank || row.rank || '',
                        callsign: row.callsign || '',
                        fullName: row.fullName || row.fullname || '',
                        birthDate: row.birthDate || row.birthdate || '',
                        serviceType: row.serviceType || row.servicetype || 'Контракт',
                        status: row.status || 'Служить',
                        phone: row.phone || '',
                        roleIds: [], // Not auto-mapping roles for simplicity yet unless specified
                    };

                    return validateRow(parsedRow);
                });

                setData(parsedRows);
            },
            error: (error) => {
                toast.error(`Error parsing CSV: ${error.message}`);
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

    const updateRowField = (id: string, field: keyof Person, value: any) => {
        setData(prev => prev.map(row => {
            if (row._id === id) {
                const updated = { ...row, [field]: value };
                return validateRow(updated);
            }
            return row;
        }));
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
            toast.error("No valid rows selected to import.");
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
                roleIds: row.roleIds || [],
            } as Person;

            // Attempt creation
            const ok = await addPerson(personToCreate);
            if (ok) successCount++;
        }

        setIsImporting(false);

        if (successCount === toImport.length) {
            toast.success(`Successfully imported ${successCount} personnel.`);
            navigate('/personnel');
        } else {
            toast.error(`Imported ${successCount} out of ${toImport.length} selected.`);
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
                <h2 className="text-3xl font-semibold text-foreground">Import Personnel</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upload CSV File</CardTitle>
                    <CardDescription>Select a .csv file containing personnel data. The system will attempt to match fields such as unit and position.</CardDescription>
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
                            <Upload className="w-4 h-4 mr-2" /> Select File
                        </Button>

                        {data.length > 0 && (
                            <Button onClick={handleImport} disabled={validSelectedCount === 0 || isImporting} className="ml-auto">
                                <Save className="w-4 h-4 mr-2" /> Import ({validSelectedCount} valid)
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {data.length > 0 && (
                <Card>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                                <tr>
                                    <th className="p-3 w-10 text-center">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => toggleAll(e.target.checked)}
                                            checked={selectedCount === data.length}
                                        />
                                    </th>
                                    <th className="p-3 w-10">Status</th>
                                    <th className="p-3">Callsign</th>
                                    <th className="p-3">Full Name</th>
                                    <th className="p-3">Rank</th>
                                    <th className="p-3">DOB</th>
                                    <th className="p-3">Unit</th>
                                    <th className="p-3">Position</th>
                                    <th className="p-3">Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(row => (
                                    <tr key={row._id} className={`border-b border-border ${!row._isValid ? 'bg-destructive/10' : ''}`}>
                                        <td className="p-3 text-center">
                                            <input
                                                type="checkbox"
                                                checked={row._selected}
                                                onChange={() => toggleRowSelection(row._id)}
                                            />
                                        </td>
                                        <td className="p-3 text-center">
                                            {row._isValid ? (
                                                <Check className="w-5 h-5 text-green-500 inline" />
                                            ) : (
                                                <AlertCircle className="w-5 h-5 text-destructive inline" title={`Missing: ${row._errors.join(', ')}`} />
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
                                                className={`flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ${row._errors.includes('rank') ? 'border-destructive' : ''}`}
                                            >
                                                <option value="">Select Rank</option>
                                                {ranks.map(r => (
                                                    <option key={r.id} value={r.name}>{r.name}</option>
                                                ))}
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
                                                <option value="">Select Unit</option>
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
                                                <option value="">Select Position</option>
                                                {positions.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-3">
                                            <Input
                                                value={row.phone || ''}
                                                onChange={e => updateRowField(row._id, 'phone', e.target.value)}
                                                className={`h-8 min-w-[130px] ${row._errors.includes('phone') ? 'border-destructive' : ''}`}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
