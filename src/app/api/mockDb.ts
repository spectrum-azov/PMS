import { Person, OrganizationalUnit, Position, Role, FunctionalDirection, RankItem } from '../types/personnel';
import {
    organizationalUnits,
    positions as seedPositions,
    roles as seedRoles,
    functionalDirections,
    mockPersonnel,
    ranks as seedRanks,
} from '../data/mockData';

// Error simulation rate (0.0 to 1.0). Set to 0 to disable.
const MOCK_ERROR_RATE = 0.01;

// In-memory database
class MockDatabase {
    personnel: Person[] = [];
    units: OrganizationalUnit[] = [];
    positions: Position[] = [];
    roles: Role[] = [];
    directions: FunctionalDirection[] = [];
    ranks: RankItem[] = [];

    constructor() {
        this.seed();
    }

    /** Seed from mockData or localStorage cache */
    seed() {
        this.personnel = this._loadOrDefault<Person[]>('personnel-data', mockPersonnel);
        this.units = this._loadOrDefault<OrganizationalUnit[]>('units-data', organizationalUnits);
        this.positions = this._loadOrDefault<Position[]>('positions-data', seedPositions);
        this.roles = this._loadOrDefault<Role[]>('roles-data', seedRoles);
        this.directions = this._loadOrDefault<FunctionalDirection[]>('directions-data', functionalDirections);
        this.ranks = this._loadOrDefault<RankItem[]>('ranks-data', seedRanks);
    }

    /** Generate a unique ID */
    nextId(): string {
        return crypto.randomUUID();
    }

    /** Persist a collection to localStorage */
    persist(key: string, data: unknown) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch {
            // localStorage may be unavailable in some environments
        }
    }

    private _loadOrDefault<T>(key: string, fallback: T): T {
        try {
            const stored = localStorage.getItem(key);
            if (stored) return JSON.parse(stored) as T;
        } catch {
            // ignore parse errors
        }
        return JSON.parse(JSON.stringify(fallback)) as T; // deep clone seed data
    }
}

/** Singleton database instance */
export const db = new MockDatabase();

/**
 * Simulates random API errors based on MOCK_ERROR_RATE.
 * Returns an error message if the call should fail, or null if it should succeed.
 */
export function maybeError(): string | null {
    if (Math.random() < MOCK_ERROR_RATE) {
        return 'Помилка мережі. Спробуйте ще раз.';
    }
    return null;
}
