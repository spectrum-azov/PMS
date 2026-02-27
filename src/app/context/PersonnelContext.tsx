import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Person, PersonnelFilters } from '../types/personnel';
import * as api from '../api/personnelApi';
import { toast } from 'sonner';

interface PersonnelContextType {
  personnel: Person[];
  filters: PersonnelFilters;
  setFilters: (filters: PersonnelFilters) => void;
  addPerson: (person: Person) => Promise<boolean>;
  updatePerson: (id: string, person: Partial<Person>) => Promise<boolean>;
  deletePerson: (id: string) => Promise<boolean>;
  getPersonById: (id: string) => Person | undefined;
  filteredPersonnel: Person[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const PersonnelContext = createContext<PersonnelContextType | undefined>(undefined);

export function PersonnelProvider({ children }: { children: React.ReactNode }) {
  const [personnel, setPersonnel] = useState<Person[]>([]);
  const [filters, setFilters] = useState<PersonnelFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load personnel from API on mount
  const loadPersonnel = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await api.getPersonnel();
    if (result.success) {
      setPersonnel(result.data);
    } else {
      setError(result.message);
      toast.error(result.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPersonnel();
  }, [loadPersonnel]);

  const addPerson = async (person: Person): Promise<boolean> => {
    const { id: _id, createdAt: _c, updatedAt: _u, ...personData } = person;
    const result = await api.createPerson(personData);
    if (result.success) {
      setPersonnel(prev => [...prev, result.data]);
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const updatePerson = async (id: string, updates: Partial<Person>): Promise<boolean> => {
    const result = await api.updatePerson(id, updates);
    if (result.success) {
      setPersonnel(prev =>
        prev.map(p => (p.id === id ? result.data : p))
      );
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const deletePerson = async (id: string): Promise<boolean> => {
    const result = await api.deletePerson(id);
    if (result.success) {
      setPersonnel(prev => prev.filter(p => p.id !== id));
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const getPersonById = (id: string) => {
    return personnel.find(p => p.id === id);
  };

  // Client-side filtering (mirrors what the API returns when filters are passed)
  const filteredPersonnel = personnel.filter(person => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        person.callsign.toLowerCase().includes(searchLower) ||
        person.fullName.toLowerCase().includes(searchLower) ||
        person.phone.includes(searchLower) ||
        person.militaryId?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (filters.unitId && person.unitId !== filters.unitId) {
      return false;
    }

    if (filters.positionId && person.positionId !== filters.positionId) {
      return false;
    }

    if (filters.status && person.status !== filters.status) {
      return false;
    }

    if (filters.serviceType && person.serviceType !== filters.serviceType) {
      return false;
    }

    if (filters.roleId && !person.roleIds.includes(filters.roleId)) {
      return false;
    }

    return true;
  });

  return (
    <PersonnelContext.Provider
      value={{
        personnel,
        filters,
        setFilters,
        addPerson,
        updatePerson,
        deletePerson,
        getPersonById,
        filteredPersonnel,
        loading,
        error,
        reload: loadPersonnel,
      }}
    >
      {children}
    </PersonnelContext.Provider>
  );
}

export function usePersonnel() {
  const context = useContext(PersonnelContext);
  if (!context) {
    throw new Error('usePersonnel must be used within PersonnelProvider');
  }
  return context;
}
