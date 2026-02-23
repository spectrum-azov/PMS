import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrganizationalUnit, Position, Role, FunctionalDirection } from '../types/personnel';
import { 
  organizationalUnits as initialUnits,
  positions as initialPositions,
  roles as initialRoles,
  functionalDirections as initialDirections
} from '../data/mockData';

interface DictionariesContextType {
  // Organizational Units
  units: OrganizationalUnit[];
  addUnit: (unit: OrganizationalUnit) => void;
  updateUnit: (id: string, unit: Partial<OrganizationalUnit>) => void;
  deleteUnit: (id: string) => void;
  getUnitById: (id: string) => OrganizationalUnit | undefined;
  
  // Positions
  positions: Position[];
  addPosition: (position: Position) => void;
  updatePosition: (id: string, position: Partial<Position>) => void;
  deletePosition: (id: string) => void;
  getPositionById: (id: string) => Position | undefined;
  
  // Roles
  roles: Role[];
  addRole: (role: Role) => void;
  updateRole: (id: string, role: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  getRoleById: (id: string) => Role | undefined;
  
  // Functional Directions
  directions: FunctionalDirection[];
  addDirection: (direction: FunctionalDirection) => void;
  updateDirection: (id: string, direction: Partial<FunctionalDirection>) => void;
  deleteDirection: (id: string) => void;
  getDirectionById: (id: string) => FunctionalDirection | undefined;
}

const DictionariesContext = createContext<DictionariesContextType | undefined>(undefined);

export function DictionariesProvider({ children }: { children: React.ReactNode }) {
  // Organizational Units
  const [units, setUnits] = useState<OrganizationalUnit[]>(() => {
    const stored = localStorage.getItem('units-data');
    return stored ? JSON.parse(stored) : initialUnits;
  });

  // Positions
  const [positions, setPositions] = useState<Position[]>(() => {
    const stored = localStorage.getItem('positions-data');
    return stored ? JSON.parse(stored) : initialPositions;
  });

  // Roles
  const [roles, setRoles] = useState<Role[]>(() => {
    const stored = localStorage.getItem('roles-data');
    return stored ? JSON.parse(stored) : initialRoles;
  });

  // Functional Directions
  const [directions, setDirections] = useState<FunctionalDirection[]>(() => {
    const stored = localStorage.getItem('directions-data');
    return stored ? JSON.parse(stored) : initialDirections;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('units-data', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('positions-data', JSON.stringify(positions));
  }, [positions]);

  useEffect(() => {
    localStorage.setItem('roles-data', JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem('directions-data', JSON.stringify(directions));
  }, [directions]);

  // Units methods
  const addUnit = (unit: OrganizationalUnit) => {
    setUnits(prev => [...prev, unit]);
  };

  const updateUnit = (id: string, updates: Partial<OrganizationalUnit>) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUnit = (id: string) => {
    setUnits(prev => prev.filter(u => u.id !== id));
  };

  const getUnitById = (id: string) => {
    return units.find(u => u.id === id);
  };

  // Positions methods
  const addPosition = (position: Position) => {
    setPositions(prev => [...prev, position]);
  };

  const updatePosition = (id: string, updates: Partial<Position>) => {
    setPositions(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePosition = (id: string) => {
    setPositions(prev => prev.filter(p => p.id !== id));
  };

  const getPositionById = (id: string) => {
    return positions.find(p => p.id === id);
  };

  // Roles methods
  const addRole = (role: Role) => {
    setRoles(prev => [...prev, role]);
  };

  const updateRole = (id: string, updates: Partial<Role>) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRole = (id: string) => {
    setRoles(prev => prev.filter(r => r.id !== id));
  };

  const getRoleById = (id: string) => {
    return roles.find(r => r.id === id);
  };

  // Directions methods
  const addDirection = (direction: FunctionalDirection) => {
    setDirections(prev => [...prev, direction]);
  };

  const updateDirection = (id: string, updates: Partial<FunctionalDirection>) => {
    setDirections(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteDirection = (id: string) => {
    setDirections(prev => prev.filter(d => d.id !== id));
  };

  const getDirectionById = (id: string) => {
    return directions.find(d => d.id === id);
  };

  return (
    <DictionariesContext.Provider
      value={{
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
      }}
    >
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
