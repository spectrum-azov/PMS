import { Person, PersonnelFilters } from '../types/personnel';
import { ApiResult } from './types';
import { db, maybeError } from './mockDb';

const STORAGE_KEY = 'personnel-data';

/** Get all personnel with optional filtering */
export async function getPersonnel(filters?: PersonnelFilters): Promise<ApiResult<Person[]>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    let result = [...db.personnel];

    if (filters) {
        if (filters.search) {
            const s = filters.search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.callsign.toLowerCase().includes(s) ||
                    p.fullName.toLowerCase().includes(s) ||
                    p.phone.includes(s) ||
                    p.militaryId?.toLowerCase().includes(s)
            );
        }
        if (filters.unitId) result = result.filter((p) => p.unitId === filters.unitId);
        if (filters.positionId) result = result.filter((p) => p.positionId === filters.positionId);
        if (filters.status) result = result.filter((p) => p.status === filters.status);
        if (filters.serviceType) result = result.filter((p) => p.serviceType === filters.serviceType);
        if (filters.roleId) result = result.filter((p) => p.roleIds.includes(filters.roleId!));
    }

    return { success: true, data: result };
}

/** Get a single person by ID */
export async function getPersonById(id: string): Promise<ApiResult<Person>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const person = db.personnel.find((p) => p.id === id);
    if (!person) return { success: false, message: 'Особу не знайдено', code: 404 };

    return { success: true, data: { ...person } };
}

/** Create a new person */
export async function createPerson(
    person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResult<Person>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const now = new Date().toISOString();
    const newPerson: Person = {
        ...person,
        id: db.nextId(),
        createdAt: now,
        updatedAt: now,
    };

    db.personnel.push(newPerson);
    db.persist(STORAGE_KEY, db.personnel);

    return { success: true, data: { ...newPerson } };
}

/** Update an existing person */
export async function updatePerson(
    id: string,
    updates: Partial<Person>
): Promise<ApiResult<Person>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const idx = db.personnel.findIndex((p) => p.id === id);
    if (idx === -1) return { success: false, message: 'Особу не знайдено', code: 404 };

    db.personnel[idx] = {
        ...db.personnel[idx],
        ...updates,
        id, // prevent ID override
        updatedAt: new Date().toISOString(),
    };
    db.persist(STORAGE_KEY, db.personnel);

    return { success: true, data: { ...db.personnel[idx] } };
}

/** Delete a person by ID */
export async function deletePerson(id: string): Promise<ApiResult<{ id: string }>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const idx = db.personnel.findIndex((p) => p.id === id);
    if (idx === -1) return { success: false, message: 'Особу не знайдено', code: 404 };

    db.personnel.splice(idx, 1);
    db.persist(STORAGE_KEY, db.personnel);

    return { success: true, data: { id } };
}

// --- Duplicate check for Import ---

export interface DuplicateCheckItem {
    callsign?: string;
    militaryId?: string;
    passport?: string;
    taxId?: string;
}

export interface DuplicateCheckResult {
    index: number;
    isDuplicate: boolean;
    matchedFields: ('callsign' | 'militaryId' | 'passport' | 'taxId')[];
}

/** Check a batch of items against existing DB personnel for duplicates */
export async function checkDuplicatesInDb(
    items: DuplicateCheckItem[]
): Promise<ApiResult<DuplicateCheckResult[]>> {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    const err = maybeError();
    if (err) return { success: false, message: err };

    const results: DuplicateCheckResult[] = items.map((item, index) => {
        const matchedFields: ('callsign' | 'militaryId' | 'passport' | 'taxId')[] = [];

        for (const person of db.personnel) {
            if (item.callsign && person.callsign && item.callsign.toLowerCase() === person.callsign.toLowerCase()) {
                if (!matchedFields.includes('callsign')) matchedFields.push('callsign');
            }
            if (item.militaryId && person.militaryId && item.militaryId === person.militaryId) {
                if (!matchedFields.includes('militaryId')) matchedFields.push('militaryId');
            }
            if (item.passport && person.passport && item.passport === person.passport) {
                if (!matchedFields.includes('passport')) matchedFields.push('passport');
            }
            if (item.taxId && person.taxId && item.taxId === person.taxId) {
                if (!matchedFields.includes('taxId')) matchedFields.push('taxId');
            }
        }

        return {
            index,
            isDuplicate: matchedFields.length > 0,
            matchedFields,
        };
    });

    return { success: true, data: results };
}
