import Papa from 'papaparse';
import { ServiceStatus, ServiceType, OrganizationalUnit, Position, RankItem } from '../types/personnel';
import { ImportRow } from '../hooks/useImportPersonnel';
import { TranslationKey } from '../i18n';

const requiredFields = ['callsign', 'fullName', 'rank', 'birthDate', 'serviceType', 'unitId', 'positionId', 'status', 'phone'];

export function cleanString(str: string): string {
    if (!str) return '';
    return str.toLowerCase().replace(/[\s\'\\]+/g, '');
}

export function validateRow(row: ImportRow): ImportRow {
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
}

export function checkDuplicates(rows: ImportRow[], t: (key: TranslationKey) => string): ImportRow[] {
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
            row._errors.push(`${t('import_duplicate')}: ${duplicateFields.join(', ')}`);
        }

        return row;
    });
}

export function parsePersonnelCsv(
    file: File,
    dictionaries: {
        units: OrganizationalUnit[];
        positions: Position[];
        ranks: RankItem[];
    },
    t: (key: TranslationKey) => string,
    onComplete: (data: ImportRow[]) => void,
    onError: (error: Error) => void
) {
    const { units, positions, ranks } = dictionaries;

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
                    tagNumber: rawTagNumber,
                    address: rawAddress,
                    registrationAddress: rawRegAddress,
                    citizenship: rawCitizenship,
                    bloodType: rawBloodType,
                    roleIds: [],
                };

                return parsedRow;
            });

            onComplete(checkDuplicates(parsedRows as ImportRow[], t));
        },
        error: onError
    });
}
