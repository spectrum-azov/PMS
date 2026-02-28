import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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

const DEBOUNCE_MS = 300;

export function PersonnelProvider({ children }: { children: React.ReactNode }) {
  const [personnel, setPersonnel] = useState<Person[]>([]);
  const [filters, setFilters] = useState<PersonnelFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep a ref of the latest filters so the debounced callback always sees them
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // Load personnel from mock API with current filters (backend-side filtering)
  const loadPersonnel = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await api.getPersonnel(filtersRef.current);
    if (result.success) {
      setPersonnel(result.data);
    } else {
      setError(result.message);
      toast.error(result.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // We fetch immediately on mount (since filters is initially {}/default)
    // and then debounce subsequent filter changes.
    // If it's the very first render, we could potentially skip the debounce, 
    // but a 300ms wait on first load is usually acceptable and cleaner.
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
      // Re-fetch to get the updated list with current filters applied
      await loadPersonnel();
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const updatePerson = async (id: string, updates: Partial<Person>): Promise<boolean> => {
    const result = await api.updatePerson(id, updates);
    if (result.success) {
      // Re-fetch to keep consistency with server-side filtered state
      await loadPersonnel();
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const deletePerson = async (id: string): Promise<boolean> => {
    const result = await api.deletePerson(id);
    if (result.success) {
      // Re-fetch to keep consistency with server-side filtered state
      await loadPersonnel();
      return true;
    }
    toast.error(result.message);
    return false;
  };

  const getPersonById = (id: string) => {
    return personnel.find(p => p.id === id);
  };

  // personnel already contains filtered results from the API
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
