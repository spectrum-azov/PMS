// Типи для системи управління особовим складом

// Довідники
export interface OrganizationalUnit {
  id: string;
  name: string;
  abbreviation?: string;
  type?: 'Частина' | 'Відділ' | 'Група';
  location?: string;
  parentId?: string;
}

export interface Position {
  id: string;
  name: string;
  category: 'positions_cat_commander' | 'positions_cat_sergeant' | 'positions_cat_soldier' | 'positions_cat_civilian';
  description?: string;
}

export interface FunctionalDirection {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
  directionId: string;
  level?: 1 | 2 | 3;
}

export type ServiceStatus = 'Служить' | 'Переведений' | 'Звільнений';

export type ServiceType = 'Контракт' | 'Мобілізований';

// Довідник: Звання
export interface RankItem {
  id: string;
  name: string;
}

export type Rank = string;

// Основна модель - Людина (P0)
export interface Person {
  id: string;

  // Основні дані (P0)
  callsign: string;
  fullName: string;
  rank: Rank;
  birthDate: string;
  serviceType: ServiceType;
  tagNumber?: string;

  // Організаційні дані (P0)
  unitId: string;
  positionId: string;
  roleIds: string[];
  status: ServiceStatus;

  // Документи (P0)
  militaryId?: string;
  passport?: string;
  taxId?: string;

  // Контакти (P0)
  phone: string;
  additionalPhones?: string[];
  address?: string;
  registrationAddress?: string;
  citizenship?: string;

  // Додаткові дані (P1)
  bloodType?: string;
  recruitedBy?: string;
  recruitedDate?: string;

  // Розширені дані (P1)
  education?: Education[];
  drivingLicense?: DrivingLicense;
  family?: Family;

  // Навички (P1)
  skills?: Skill[];

  // Допуски (P3)
  clearances?: string[];

  // Медичні дані (P3)
  medical?: MedicalInfo;

  // Нагороди (P2)
  awards?: Award[];

  // Метадані
  createdAt: string;
  updatedAt: string;
}

// Розширені дані (P1)
export interface Education {
  id: string;
  institution: string;
  startYear: number;
  endYear: number;
  degree: string;
  specialty: string;
}

export interface DrivingLicense {
  categories: string[];
  yearObtained: number;
  experience: number;
}

export interface Family {
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  children?: Array<{
    fullName: string;
    birthDate: string;
  }>;
  siblings?: Array<{
    fullName: string;
    birthDate: string;
    phone?: string;
  }>;
}

export interface Skill {
  id: string;
  name: string;
  level: 0 | 1 | 2 | 3;
  category: string;
}

export interface MedicalInfo {
  fitnessCategory?: string;
  limitations?: string;
  allergies?: string;
  lastExamDate?: string;
}

export interface Award {
  id: string;
  type: string;
  name: string;
  level: 'Державна' | 'Корпус' | 'Частина' | 'Підрозділ';
  dateAwarded: string;
  reason: string;
  orderNumber?: string;
  signedBy?: string;
  documentUrl?: string;
  status: 'Активна' | 'Анульована';
  comment?: string;
}

// Параметри пагінації
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// Параметри сортування
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Фільтри для реєстру
export interface PersonnelFilters extends PaginationParams, SortParams {
  search?: string;
  unitId?: string;
  positionId?: string;
  status?: ServiceStatus;
  serviceType?: ServiceType;
  roleId?: string;
}
