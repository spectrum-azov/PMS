import { OrganizationalUnit, Position, Role, FunctionalDirection, RankItem } from '../types/personnel';
import { ApiResult } from './types';

const API_BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') + '/api';

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

// ═══════════════════════════════════════════
// Organizational Units
// ═══════════════════════════════════════════

export async function getUnits(): Promise<ApiResult<OrganizationalUnit[]>> {
    const response = await fetch(`${API_BASE}/units`);
    return handleResponse<OrganizationalUnit[]>(response);
}

export async function createUnit(
    unit: Omit<OrganizationalUnit, 'id'>
): Promise<ApiResult<OrganizationalUnit>> {
    const response = await fetch(`${API_BASE}/units`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unit),
    });
    return handleResponse<OrganizationalUnit>(response);
}

export async function updateUnit(
    id: string,
    updates: Partial<OrganizationalUnit>
): Promise<ApiResult<OrganizationalUnit>> {
    const response = await fetch(`${API_BASE}/units/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    return handleResponse<OrganizationalUnit>(response);
}

export async function deleteUnit(id: string): Promise<ApiResult<{ id: string }>> {
    const response = await fetch(`${API_BASE}/units/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<{ id: string }>(response);
}

// ═══════════════════════════════════════════
// Positions
// ═══════════════════════════════════════════

export async function getPositions(): Promise<ApiResult<Position[]>> {
    const response = await fetch(`${API_BASE}/positions`);
    return handleResponse<Position[]>(response);
}

export async function createPosition(
    position: Omit<Position, 'id'>
): Promise<ApiResult<Position>> {
    const response = await fetch(`${API_BASE}/positions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(position),
    });
    return handleResponse<Position>(response);
}

export async function updatePosition(
    id: string,
    updates: Partial<Position>
): Promise<ApiResult<Position>> {
    const response = await fetch(`${API_BASE}/positions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    return handleResponse<Position>(response);
}

export async function deletePosition(id: string): Promise<ApiResult<{ id: string }>> {
    const response = await fetch(`${API_BASE}/positions/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<{ id: string }>(response);
}

// ═══════════════════════════════════════════
// Roles
// ═══════════════════════════════════════════

export async function getRoles(): Promise<ApiResult<Role[]>> {
    const response = await fetch(`${API_BASE}/roles`);
    return handleResponse<Role[]>(response);
}

export async function createRole(role: Omit<Role, 'id'>): Promise<ApiResult<Role>> {
    const response = await fetch(`${API_BASE}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(role),
    });
    return handleResponse<Role>(response);
}

export async function updateRole(
    id: string,
    updates: Partial<Role>
): Promise<ApiResult<Role>> {
    const response = await fetch(`${API_BASE}/roles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    return handleResponse<Role>(response);
}

export async function deleteRole(id: string): Promise<ApiResult<{ id: string }>> {
    const response = await fetch(`${API_BASE}/roles/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<{ id: string }>(response);
}

// ═══════════════════════════════════════════
// Functional Directions
// ═══════════════════════════════════════════

export async function getDirections(): Promise<ApiResult<FunctionalDirection[]>> {
    const response = await fetch(`${API_BASE}/directions`);
    return handleResponse<FunctionalDirection[]>(response);
}

export async function createDirection(
    direction: Omit<FunctionalDirection, 'id'>
): Promise<ApiResult<FunctionalDirection>> {
    const response = await fetch(`${API_BASE}/directions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(direction),
    });
    return handleResponse<FunctionalDirection>(response);
}

export async function updateDirection(
    id: string,
    updates: Partial<FunctionalDirection>
): Promise<ApiResult<FunctionalDirection>> {
    const response = await fetch(`${API_BASE}/directions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    return handleResponse<FunctionalDirection>(response);
}

export async function deleteDirection(id: string): Promise<ApiResult<{ id: string }>> {
    const response = await fetch(`${API_BASE}/directions/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<{ id: string }>(response);
}

// ═══════════════════════════════════════════
// Ranks
// ═══════════════════════════════════════════

export async function getRanks(): Promise<ApiResult<RankItem[]>> {
    const response = await fetch(`${API_BASE}/ranks`);
    return handleResponse<RankItem[]>(response);
}

export async function createRank(
    rank: Omit<RankItem, 'id'>
): Promise<ApiResult<RankItem>> {
    const response = await fetch(`${API_BASE}/ranks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rank),
    });
    return handleResponse<RankItem>(response);
}

export async function updateRank(
    id: string,
    updates: Partial<RankItem>
): Promise<ApiResult<RankItem>> {
    const response = await fetch(`${API_BASE}/ranks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    return handleResponse<RankItem>(response);
}

export async function deleteRank(id: string): Promise<ApiResult<{ id: string }>> {
    const response = await fetch(`${API_BASE}/ranks/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<{ id: string }>(response);
}

