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
