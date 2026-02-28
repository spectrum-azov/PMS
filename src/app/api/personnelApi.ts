import { Person, PersonnelFilters } from '../types/personnel';
import { ApiResult } from './types';

const API_BASE = '/api';

/** Utility to handle fetch responses */
async function handleResponse<T>(response: Response): Promise<ApiResult<T>> {
    if (!response.ok) {
        try {
            const err = await response.json();
            return { success: false, message: err.message || 'Помилка сервера' };
        } catch {
            return { success: false, message: `Помилка сервера: ${response.status}` };
        }
    }
    return await response.json();
}

/** Get all personnel with optional filtering */
export async function getPersonnel(filters?: PersonnelFilters): Promise<ApiResult<Person[]>> {
    const params = new URLSearchParams();
    if (filters) {
        if (filters.search) params.append('search', filters.search);
        if (filters.unitId) params.append('unitId', filters.unitId);
        if (filters.positionId) params.append('positionId', filters.positionId);
        if (filters.status) params.append('status', filters.status);
        if (filters.serviceType) params.append('serviceType', filters.serviceType);
        if (filters.roleId) params.append('roleId', filters.roleId);
    }

    const response = await fetch(`${API_BASE}/personnel?${params.toString()}`);
    return handleResponse<Person[]>(response);
}

/** Get a single person by ID */
export async function getPersonById(id: string): Promise<ApiResult<Person>> {
    const response = await fetch(`${API_BASE}/personnel/${id}`);
    return handleResponse<Person>(response);
}

/** Create a new person */
export async function createPerson(
    person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResult<Person>> {
    const response = await fetch(`${API_BASE}/personnel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(person),
    });
    return handleResponse<Person>(response);
}

/** Update an existing person */
export async function updatePerson(
    id: string,
    updates: Partial<Person>
): Promise<ApiResult<Person>> {
    const response = await fetch(`${API_BASE}/personnel/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    return handleResponse<Person>(response);
}

/** Delete a person by ID */
export async function deletePerson(id: string): Promise<ApiResult<{ id: string }>> {
    const response = await fetch(`${API_BASE}/personnel/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<{ id: string }>(response);
}

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
    const response = await fetch(`${API_BASE}/personnel/check-duplicates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
    });
    return handleResponse<DuplicateCheckResult[]>(response);
}
