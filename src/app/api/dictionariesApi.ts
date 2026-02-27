import { OrganizationalUnit, Position, Role, FunctionalDirection, RankItem } from '../types/personnel';
import { ApiResult } from './types';
import { db, maybeError } from './mockDb';

// ═══════════════════════════════════════════
// Organizational Units
// ═══════════════════════════════════════════

const UNITS_KEY = 'units-data';

export async function getUnits(): Promise<ApiResult<OrganizationalUnit[]>> {
    const err = maybeError();
    if (err) return { success: false, message: err };
    return { success: true, data: [...db.units] };
}

export async function createUnit(
    unit: Omit<OrganizationalUnit, 'id'>
): Promise<ApiResult<OrganizationalUnit>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const newUnit: OrganizationalUnit = { ...unit, id: db.nextId() };
    db.units.push(newUnit);
    db.persist(UNITS_KEY, db.units);
    return { success: true, data: { ...newUnit } };
}

export async function updateUnit(
    id: string,
    updates: Partial<OrganizationalUnit>
): Promise<ApiResult<OrganizationalUnit>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const idx = db.units.findIndex((u) => u.id === id);
    if (idx === -1) return { success: false, message: 'Підрозділ не знайдено', code: 404 };

    db.units[idx] = { ...db.units[idx], ...updates, id };
    db.persist(UNITS_KEY, db.units);
    return { success: true, data: { ...db.units[idx] } };
}

export async function deleteUnit(id: string): Promise<ApiResult<{ id: string }>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const idx = db.units.findIndex((u) => u.id === id);
    if (idx === -1) return { success: false, message: 'Підрозділ не знайдено', code: 404 };

    db.units.splice(idx, 1);
    db.persist(UNITS_KEY, db.units);
    return { success: true, data: { id } };
}

// ═══════════════════════════════════════════
// Positions
// ═══════════════════════════════════════════

const POSITIONS_KEY = 'positions-data';

export async function getPositions(): Promise<ApiResult<Position[]>> {
    const err = maybeError();
    if (err) return { success: false, message: err };
    return { success: true, data: [...db.positions] };
}

export async function createPosition(
    position: Omit<Position, 'id'>
): Promise<ApiResult<Position>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const newPos: Position = { ...position, id: db.nextId() };
    db.positions.push(newPos);
    db.persist(POSITIONS_KEY, db.positions);
    return { success: true, data: { ...newPos } };
}

export async function updatePosition(
    id: string,
    updates: Partial<Position>
): Promise<ApiResult<Position>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const idx = db.positions.findIndex((p) => p.id === id);
    if (idx === -1) return { success: false, message: 'Посаду не знайдено', code: 404 };

    db.positions[idx] = { ...db.positions[idx], ...updates, id };
    db.persist(POSITIONS_KEY, db.positions);
    return { success: true, data: { ...db.positions[idx] } };
}

export async function deletePosition(id: string): Promise<ApiResult<{ id: string }>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const idx = db.positions.findIndex((p) => p.id === id);
    if (idx === -1) return { success: false, message: 'Посаду не знайдено', code: 404 };

    db.positions.splice(idx, 1);
    db.persist(POSITIONS_KEY, db.positions);
    return { success: true, data: { id } };
}

// ═══════════════════════════════════════════
// Roles
// ═══════════════════════════════════════════

const ROLES_KEY = 'roles-data';

export async function getRoles(): Promise<ApiResult<Role[]>> {
    const err = maybeError();
    if (err) return { success: false, message: err };
    return { success: true, data: [...db.roles] };
}

export async function createRole(role: Omit<Role, 'id'>): Promise<ApiResult<Role>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const newRole: Role = { ...role, id: db.nextId() };
    db.roles.push(newRole);
    db.persist(ROLES_KEY, db.roles);
    return { success: true, data: { ...newRole } };
}

export async function updateRole(
    id: string,
    updates: Partial<Role>
): Promise<ApiResult<Role>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const idx = db.roles.findIndex((r) => r.id === id);
    if (idx === -1) return { success: false, message: 'Роль не знайдено', code: 404 };

    db.roles[idx] = { ...db.roles[idx], ...updates, id };
    db.persist(ROLES_KEY, db.roles);
    return { success: true, data: { ...db.roles[idx] } };
}

export async function deleteRole(id: string): Promise<ApiResult<{ id: string }>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const idx = db.roles.findIndex((r) => r.id === id);
    if (idx === -1) return { success: false, message: 'Роль не знайдено', code: 404 };

    db.roles.splice(idx, 1);
    db.persist(ROLES_KEY, db.roles);
    return { success: true, data: { id } };
}

// ═══════════════════════════════════════════
// Functional Directions
// ═══════════════════════════════════════════

const DIRECTIONS_KEY = 'directions-data';

export async function getDirections(): Promise<ApiResult<FunctionalDirection[]>> {
    const err = maybeError();
    if (err) return { success: false, message: err };
    return { success: true, data: [...db.directions] };
}

export async function createDirection(
    direction: Omit<FunctionalDirection, 'id'>
): Promise<ApiResult<FunctionalDirection>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const newDir: FunctionalDirection = { ...direction, id: db.nextId() };
    db.directions.push(newDir);
    db.persist(DIRECTIONS_KEY, db.directions);
    return { success: true, data: { ...newDir } };
}

export async function updateDirection(
    id: string,
    updates: Partial<FunctionalDirection>
): Promise<ApiResult<FunctionalDirection>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const idx = db.directions.findIndex((d) => d.id === id);
    if (idx === -1) return { success: false, message: 'Напрямок не знайдено', code: 404 };

    db.directions[idx] = { ...db.directions[idx], ...updates, id };
    db.persist(DIRECTIONS_KEY, db.directions);
    return { success: true, data: { ...db.directions[idx] } };
}

export async function deleteDirection(id: string): Promise<ApiResult<{ id: string }>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const idx = db.directions.findIndex((d) => d.id === id);
    if (idx === -1) return { success: false, message: 'Напрямок не знайдено', code: 404 };

    db.directions.splice(idx, 1);
    db.persist(DIRECTIONS_KEY, db.directions);
    return { success: true, data: { id } };
}

// ═══════════════════════════════════════════
// Ranks
// ═══════════════════════════════════════════

const RANKS_KEY = 'ranks-data';

export async function getRanks(): Promise<ApiResult<RankItem[]>> {
    const err = maybeError();
    if (err) return { success: false, message: err };
    return { success: true, data: [...db.ranks] };
}

export async function createRank(
    rank: Omit<RankItem, 'id'>
): Promise<ApiResult<RankItem>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const newRank: RankItem = { ...rank, id: db.nextId() };
    db.ranks.push(newRank);
    db.persist(RANKS_KEY, db.ranks);
    return { success: true, data: { ...newRank } };
}

export async function updateRank(
    id: string,
    updates: Partial<RankItem>
): Promise<ApiResult<RankItem>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const idx = db.ranks.findIndex((r) => r.id === id);
    if (idx === -1) return { success: false, message: 'Звання не знайдено', code: 404 };

    db.ranks[idx] = { ...db.ranks[idx], ...updates, id };
    db.persist(RANKS_KEY, db.ranks);
    return { success: true, data: { ...db.ranks[idx] } };
}

export async function deleteRank(id: string): Promise<ApiResult<{ id: string }>> {
    const err = maybeError();
    if (err) return { success: false, message: err };

    const idx = db.ranks.findIndex((r) => r.id === id);
    if (idx === -1) return { success: false, message: 'Звання не знайдено', code: 404 };

    db.ranks.splice(idx, 1);
    db.persist(RANKS_KEY, db.ranks);
    return { success: true, data: { id } };
}
