import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { OrganizationalUnit, Position, Role, FunctionalDirection, RankItem } from '../types/personnel';
import * as dictApi from '../api/dictionariesApi';
import { toast } from 'sonner';

interface DictionariesContextType {
  // Organizational Units
  units: OrganizationalUnit[];
  addUnit: (unit: OrganizationalUnit) => Promise<boolean>;
  updateUnit: (id: string, unit: Partial<OrganizationalUnit>) => Promise<boolean>;
  deleteUnit: (id: string) => Promise<boolean>;
  getUnitById: (id: string) => OrganizationalUnit | undefined;

  // Positions
  positions: Position[];
  addPosition: (position: Position) => Promise<boolean>;
  updatePosition: (id: string, position: Partial<Position>) => Promise<boolean>;
  deletePosition: (id: string) => Promise<boolean>;
  getPositionById: (id: string) => Position | undefined;

  // Roles
  roles: Role[];
  addRole: (role: Role) => Promise<boolean>;
  updateRole: (id: string, role: Partial<Role>) => Promise<boolean>;
  deleteRole: (id: string) => Promise<boolean>;
  getRoleById: (id: string) => Role | undefined;

  // Functional Directions
  directions: FunctionalDirection[];
  addDirection: (direction: FunctionalDirection) => Promise<boolean>;
  updateDirection: (id: string, direction: Partial<FunctionalDirection>) => Promise<boolean>;
  deleteDirection: (id: string) => Promise<boolean>;
  getDirectionById: (id: string) => FunctionalDirection | undefined;

  // Ranks
  ranks: RankItem[];
  addRank: (rank: RankItem) => Promise<boolean>;
  updateRank: (id: string, rank: Partial<RankItem>) => Promise<boolean>;
  deleteRank: (id: string) => Promise<boolean>;
  getRankById: (id: string) => RankItem | undefined;

  // Loading / error
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const DictionariesContext = createContext<DictionariesContextType | undefined>(undefined);

export function DictionariesProvider({ children }: { children: React.ReactNode }) {
  const [units, setUnits] = useState<OrganizationalUnit[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [directions, setDirections] = useState<FunctionalDirection[]>([]);
  const [ranks, setRanks] = useState<RankItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all dictionaries from API
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [unitsRes, posRes, rolesRes, dirRes, ranksRes] = await Promise.all([
      dictApi.getUnits(),
      dictApi.getPositions(),
      dictApi.getRoles(),
      dictApi.getDirections(),
      dictApi.getRanks(),
    ]);

    let hasError = false;
    if (unitsRes.success) setUnits(unitsRes.data);
    else hasError = true;
    if (posRes.success) setPositions(posRes.data);
    else hasError = true;
    if (rolesRes.success) setRoles(rolesRes.data);
    else hasError = true;
    if (dirRes.success) setDirections(dirRes.data);
    else hasError = true;
    if (ranksRes.success) setRanks(ranksRes.data);
    else hasError = true;

    if (hasError) {
      const msg = 'Помилка завантаження довідників';
      setError(msg);
      toast.error(msg);
    }

    setLoading(false);
  }, []);

  const isMounted = React.useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      loadAll();
    }
  }, [loadAll]);

  // ─── Units ────────────────────────────────

  const addUnit = async (unit: OrganizationalUnit): Promise<boolean> => {
    const { id: _id, ...data } = unit;
    const result = await dictApi.createUnit(data);
    if (result.success) {
      setUnits(prev => [...prev, result.data]);
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const updateUnit = async (id: string, updates: Partial<OrganizationalUnit>): Promise<boolean> => {
    const result = await dictApi.updateUnit(id, updates);
    if (result.success) {
      setUnits(prev => prev.map(u => (u.id === id ? result.data : u)));
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const deleteUnit = async (id: string): Promise<boolean> => {
    const result = await dictApi.deleteUnit(id);
    if (result.success) {
      setUnits(prev => prev.filter(u => u.id !== id));
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const getUnitById = (id: string) => units.find(u => u.id === id);

  // ─── Positions ────────────────────────────

  const addPosition = async (position: Position): Promise<boolean> => {
    const { id: _id, ...data } = position;
    const result = await dictApi.createPosition(data);
    if (result.success) {
      setPositions(prev => [...prev, result.data]);
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const updatePosition = async (id: string, updates: Partial<Position>): Promise<boolean> => {
    const result = await dictApi.updatePosition(id, updates);
    if (result.success) {
      setPositions(prev => prev.map(p => (p.id === id ? result.data : p)));
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const deletePosition = async (id: string): Promise<boolean> => {
    const result = await dictApi.deletePosition(id);
    if (result.success) {
      setPositions(prev => prev.filter(p => p.id !== id));
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const getPositionById = (id: string) => positions.find(p => p.id === id);

  // ─── Roles ────────────────────────────────

  const addRole = async (role: Role): Promise<boolean> => {
    const { id: _id, ...data } = role;
    const result = await dictApi.createRole(data);
    if (result.success) {
      setRoles(prev => [...prev, result.data]);
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const updateRole = async (id: string, updates: Partial<Role>): Promise<boolean> => {
    const result = await dictApi.updateRole(id, updates);
    if (result.success) {
      setRoles(prev => prev.map(r => (r.id === id ? result.data : r)));
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const deleteRole = async (id: string): Promise<boolean> => {
    const result = await dictApi.deleteRole(id);
    if (result.success) {
      setRoles(prev => prev.filter(r => r.id !== id));
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const getRoleById = (id: string) => roles.find(r => r.id === id);

  // ─── Directions ───────────────────────────

  const addDirection = async (direction: FunctionalDirection): Promise<boolean> => {
    const { id: _id, ...data } = direction;
    const result = await dictApi.createDirection(data);
    if (result.success) {
      setDirections(prev => [...prev, result.data]);
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const updateDirection = async (id: string, updates: Partial<FunctionalDirection>): Promise<boolean> => {
    const result = await dictApi.updateDirection(id, updates);
    if (result.success) {
      setDirections(prev => prev.map(d => (d.id === id ? result.data : d)));
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const deleteDirection = async (id: string): Promise<boolean> => {
    const result = await dictApi.deleteDirection(id);
    if (result.success) {
      setDirections(prev => prev.filter(d => d.id !== id));
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const getDirectionById = (id: string) => directions.find(d => d.id === id);

  // ─── Ranks ────────────────────────────────

  const addRank = async (rank: RankItem): Promise<boolean> => {
    const { id: _id, ...data } = rank;
    const result = await dictApi.createRank(data);
    if (result.success) {
      setRanks(prev => [...prev, result.data]);
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const updateRank = async (id: string, updates: Partial<RankItem>): Promise<boolean> => {
    const result = await dictApi.updateRank(id, updates);
    if (result.success) {
      setRanks(prev => prev.map(r => (r.id === id ? result.data : r)));
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const deleteRank = async (id: string): Promise<boolean> => {
    const result = await dictApi.deleteRank(id);
    if (result.success) {
      setRanks(prev => prev.filter(r => r.id !== id));
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const getRankById = (id: string) => ranks.find(r => r.id === id);

  const contextValue = React.useMemo(() => ({
    units,
    addUnit,
    updateUnit,
    deleteUnit,
    getUnitById,
    positions,
    addPosition,
    updatePosition,
    deletePosition,
    getPositionById,
    roles,
    addRole,
    updateRole,
    deleteRole,
    getRoleById,
    directions,
    addDirection,
    updateDirection,
    deleteDirection,
    getDirectionById,
    ranks,
    addRank,
    updateRank,
    deleteRank,
    getRankById,
    loading,
    error,
    reload: loadAll,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [units, positions, roles, directions, ranks, loading, error, loadAll]);

  return (
    <DictionariesContext.Provider value={contextValue}>
      {children}
    </DictionariesContext.Provider>
  );
}

export function useDictionaries() {
  const context = useContext(DictionariesContext);
  if (!context) {
    throw new Error('useDictionaries must be used within DictionariesProvider');
  }
  return context;
}
