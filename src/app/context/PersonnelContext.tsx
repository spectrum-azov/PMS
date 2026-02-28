import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Person, PersonnelFilters } from '../types/personnel';
import * as api from '../api/personnelApi';
import { toast } from 'sonner';

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
  const [personnel, setPersonnel] = useState<Person[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<PersonnelFilters>(() => {
    if (typeof window === 'undefined') return { page: 1, pageSize: 25 };
    const savedSize = localStorage.getItem('personnel-page-size');
    return {
      page: 1,
      pageSize: savedSize ? parseInt(savedSize, 10) : 25
    };
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep a ref of the latest filters so the debounced callback always sees them
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // Load personnel from mock API with current filters (backend-side filtering, pagination and sorting)
  const loadPersonnel = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await api.getPersonnel(filtersRef.current);
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

  // Guard to prevent double execution in StrictMode
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      loadPersonnel();
      return;
    }

    const timer = setTimeout(() => {
      loadPersonnel();
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const addPerson = async (person: Person): Promise<boolean> => {
    const { id: _id, createdAt: _c, updatedAt: _u, ...personData } = person;
    const result = await api.createPerson(personData);
    if (result.success) {
      await loadPersonnel();
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const updatePerson = async (id: string, updates: Partial<Person>): Promise<boolean> => {
    const result = await api.updatePerson(id, updates);
    if (result.success) {
      await loadPersonnel();
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const deletePerson = async (id: string): Promise<boolean> => {
    const result = await api.deletePerson(id);
    if (result.success) {
      await loadPersonnel();
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
