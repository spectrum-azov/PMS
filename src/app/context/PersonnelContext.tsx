import React, { createContext, useContext, useState, useEffect } from 'react';
import { Person, PersonnelFilters } from '../types/personnel';
import { mockPersonnel } from '../data/mockData';

interface PersonnelContextType {
  personnel: Person[];
  filters: PersonnelFilters;
  setFilters: (filters: PersonnelFilters) => void;
  addPerson: (person: Person) => void;
  updatePerson: (id: string, person: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  getPersonById: (id: string) => Person | undefined;
  filteredPersonnel: Person[];
}

const PersonnelContext = createContext<PersonnelContextType | undefined>(undefined);

export function PersonnelProvider({ children }: { children: React.ReactNode }) {
  const [personnel, setPersonnel] = useState<Person[]>(() => {
    // Спробуємо завантажити з localStorage
    const stored = localStorage.getItem('personnel-data');
    return stored ? JSON.parse(stored) : mockPersonnel;
  });

  const [filters, setFilters] = useState<PersonnelFilters>({});

  // Зберігаємо в localStorage при зміні
  useEffect(() => {
    localStorage.setItem('personnel-data', JSON.stringify(personnel));
  }, [personnel]);

  const addPerson = (person: Person) => {
    setPersonnel(prev => [...prev, person]);
  };

  const updatePerson = (id: string, updates: Partial<Person>) => {
    setPersonnel(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const deletePerson = (id: string) => {
    setPersonnel(prev => prev.filter(p => p.id !== id));
  };

  const getPersonById = (id: string) => {
    return personnel.find(p => p.id === id);
  };

  // Фільтрація персоналу
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
        filteredPersonnel
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
