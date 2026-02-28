import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Person, PersonnelFilters } from '../types/personnel';
import * as api from '../api/personnelApi';
import { toast } from 'sonner';
import { useSettings } from './SettingsContext';

interface PersonnelContextType {
  personnel: Person[];
  filters: PersonnelFilters;
  setFilters: (filters: PersonnelFilters | ((prev: PersonnelFilters) => PersonnelFilters)) => void;
  addPerson: (person: Person) => Promise<boolean>;
  updatePerson: (id: string, person: Partial<Person>) => Promise<boolean>;
  deletePerson: (id: string) => Promise<boolean>;
  getPersonById: (id: string) => Person | undefined;
  filteredPersonnel: Person[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const PersonnelContext = createContext<PersonnelContextType | undefined>(undefined);

const DEBOUNCE_MS = 300;

export function PersonnelProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const isInfiniteScroll = settings.tableDisplayMode === 'infiniteScroll';

  const [personnel, setPersonnel] = useState<Person[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<PersonnelFilters>(() => {
    if (typeof window === 'undefined') return { page: 1, pageSize: 25, sortBy: 'callsign', sortOrder: 'asc' };
    const savedSize = localStorage.getItem('personnel-page-size');
    return {
      page: 1,
      pageSize: savedSize ? parseInt(savedSize, 10) : 25,
      sortBy: 'callsign',
      sortOrder: 'asc',
    };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load personnel from mock API with current filters (backend-side filtering, pagination and sorting)
  const loadPersonnel = useCallback(async (currentFilters: PersonnelFilters) => {
    setLoading(true);
    setError(null);

    const result = await api.getPersonnel(currentFilters);
    if (result.success) {
      setPersonnel(result.data);
      // If server provides total, use it, otherwise use local data length
      setTotalCount(result.total !== undefined ? result.total : result.data.length);
    } else {
      setError(result.message);
      toast.error(result.message);
    }
    setLoading(false);
  }, []);
  // Debounce all filter changes (including initial mount).
  // StrictMode's cleanup cancels the first timer, so only one request fires.
  // Skip when in infinite scroll mode — PersonnelRegistry's useInfiniteScroll handles fetching.
  // Note: isInfiniteScroll is intentionally NOT in deps — we don't want toggling
  // the setting to trigger a fetch; only actual filter changes should.
  useEffect(() => {
    if (isInfiniteScroll) return;

    const timer = setTimeout(() => {
      loadPersonnel(filters);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const addPerson = async (person: Person): Promise<boolean> => {
    const { id: _id, createdAt: _c, updatedAt: _u, ...personData } = person;
    const result = await api.createPerson(personData);
    if (result.success) {
      await loadPersonnel(filters);
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const updatePerson = async (id: string, updates: Partial<Person>): Promise<boolean> => {
    const result = await api.updatePerson(id, updates);
    if (result.success) {
      await loadPersonnel(filters);
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const deletePerson = async (id: string): Promise<boolean> => {
    const result = await api.deletePerson(id);
    if (result.success) {
      await loadPersonnel(filters);
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const getPersonById = (id: string) => {
    return personnel.find(p => p.id === id);
  };

  const filteredPersonnel = personnel;

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
        totalCount,
        loading,
        error,
        reload: () => loadPersonnel(filters),
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
