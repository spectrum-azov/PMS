import { OrganizationalUnit, Position, FunctionalDirection, Role, Person, RankItem } from '../types/personnel';

// Довідник: Звання
export const ranks: RankItem[] = [
  { id: 'rank1', name: 'Солдат' },
  { id: 'rank2', name: 'Старший солдат' },
  { id: 'rank3', name: 'Молодший сержант' },
  { id: 'rank4', name: 'Сержант' },
  { id: 'rank5', name: 'Старший сержант' },
  { id: 'rank6', name: 'Головний сержант' },
  { id: 'rank7', name: 'Штаб-сержант' },
  { id: 'rank8', name: 'Майстер-сержант' },
  { id: 'rank9', name: 'Головний майстер-сержант' },
  { id: 'rank10', name: 'Молодший лейтенант' },
  { id: 'rank11', name: 'Лейтенант' },
  { id: 'rank12', name: 'Старший лейтенант' },
  { id: 'rank13', name: 'Капітан' },
  { id: 'rank14', name: 'Майор' },
  { id: 'rank15', name: 'Підполковник' },
  { id: 'rank16', name: 'Полковник' },
];

// Довідник: Організаційна структура
export const organizationalUnits: OrganizationalUnit[] = [
  {
    id: '1',
    name: '1-й корпус',
    abbreviation: '1 АК',
    type: 'Частина',
    location: 'Київ'
  },
  {
    id: '2',
    name: 'Підрозділи забезпечення',
    abbreviation: 'ПЗ',
    type: 'Відділ',
    parentId: '1'
  },
  {
    id: '3',
    name: 'Вузол зв\'язку',
    abbreviation: 'ВЗ',
    type: 'Група',
    location: 'Київ',
    parentId: '2'
  },
  {
    id: '4',
    name: 'Керівництво вузла',
    abbreviation: 'КВ',
    type: 'Група',
    parentId: '3'
  },
  {
    id: '5',
    name: 'Група мереж та ІТ',
    abbreviation: 'IT',
    type: 'Група',
    location: 'Київ',
    parentId: '3'
  },
  {
    id: '6',
    name: 'Група криптозахисту',
    abbreviation: 'КЗ',
    type: 'Група',
    parentId: '3'
  },
  {
    id: '7',
    name: 'Група ремонту',
    abbreviation: 'РМ',
    type: 'Група',
    parentId: '3'
  },
  {
    id: '8',
    name: 'Група радіозв\'язку',
    abbreviation: 'РЗ',
    type: 'Група',
    parentId: '3'
  }
];

// Довідник: Посади
export const positions: Position[] = [
  { id: 'pos1', name: 'Начальник вузла', category: 'positions_cat_commander', description: 'Керівник підрозділу' },
  { id: 'pos2', name: 'Старший зміни', category: 'positions_cat_sergeant', description: 'Організація роботи зміни' },
  { id: 'pos3', name: 'Оператор радіозв\'язку', category: 'positions_cat_soldier', description: 'Обслуговування радіомережі' },
  { id: 'pos4', name: 'Системний адміністратор', category: 'positions_cat_soldier', description: 'Адміністрування мереж' },
  { id: 'pos5', name: 'Оператор РРЛ', category: 'positions_cat_soldier', description: 'Обслуговування ретрансляторів' },
  { id: 'pos6', name: 'Інженер супутникового зв\'язку', category: 'positions_cat_soldier', description: 'Супутниковий зв\'язок' },
  { id: 'pos7', name: 'Інженер криптозахисту', category: 'positions_cat_soldier', description: 'Криптографічний захист' },
  { id: 'pos8', name: 'Технік з ремонту', category: 'positions_cat_soldier', description: 'Ремонт обладнання' }
];

// Довідник: Функціональні напрямки
export const functionalDirections: FunctionalDirection[] = [
  { id: 'dir1', name: 'Радіозв\'язок' },
  { id: 'dir2', name: 'Мережі та ІТ' },
  { id: 'dir3', name: 'РРЛ' },
  { id: 'dir4', name: 'Супутниковий зв\'язок' },
  { id: 'dir5', name: 'Криптозахист' },
  { id: 'dir6', name: 'Ремонт' }
];

// Довідник: Ролі
export const roles: Role[] = [
  { id: 'role1', name: 'HF-оператор', directionId: 'dir1', level: 3 },
  { id: 'role2', name: 'VHF-оператор', directionId: 'dir1', level: 2 },
  { id: 'role3', name: 'Антенне господарство', directionId: 'dir1', level: 2 },
  { id: 'role4', name: 'Mikrotik/RouterOS', directionId: 'dir2', level: 3 },
  { id: 'role5', name: 'VPN (WireGuard/OpenVPN)', directionId: 'dir2', level: 3 },
  { id: 'role6', name: 'Wi-Fi мости', directionId: 'dir2', level: 2 },
  { id: 'role7', name: 'Бекапи/відновлення', directionId: 'dir2', level: 2 },
  { id: 'role8', name: 'Розгортання ретранслятора', directionId: 'dir3', level: 2 },
  { id: 'role9', name: 'Юстування антен', directionId: 'dir3', level: 3 },
  { id: 'role10', name: 'Супутниковий термінал', directionId: 'dir4', level: 2 },
  { id: 'role11', name: 'Криптографічні ключі', directionId: 'dir5', level: 3 },
  { id: 'role12', name: 'Діагностика обладнання', directionId: 'dir6', level: 2 }
];

// Mock дані: Люди
export const mockPersonnel: Person[] = [
  {
    id: '1',
    callsign: 'Сатурн',
    fullName: 'Іваненко Іван Іванович',
    rank: 'Старший сержант',
    birthDate: '1993-04-12',
    serviceType: 'Контракт',
    tagNumber: '1245',
    unitId: '8',
    positionId: 'pos3',
    roleIds: ['role1', 'role3'],
    status: 'Служить',
    militaryId: 'АА 123456',
    passport: 'КВ 987654',
    taxId: '2123123123',
    phone: '+38 098 123-45-67',
    additionalPhones: ['+38 098 123-45-68'],
    address: 'Київ, вул Абв 1',
    registrationAddress: 'Київ, вул Абв 2',
    citizenship: 'Україна',
    bloodType: 'A (II) Rh+',
    recruitedBy: 'Шевченківський ТЦК',
    recruitedDate: '2022-03-15',
    education: [
      {
        id: 'edu1',
        institution: 'ХНУРЕ',
        startYear: 2017,
        endYear: 2022,
        degree: 'Магістр',
        specialty: 'Телекомунікації'
      }
    ],
    drivingLicense: {
      categories: ['B'],
      yearObtained: 2005,
      experience: 20
    },
    family: {
      emergencyContact: {
        name: 'Іваненко Марія Петрівна',
        phone: '+38 098 111-22-33',
        relation: 'Дружина'
      }
    },
    skills: [
      { id: 's1', name: 'HF радіостанції', level: 3, category: 'Радіозв\'язок' },
      { id: 's2', name: 'Монтаж антен', level: 2, category: 'Радіозв\'язок' }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-20T14:30:00Z'
  },
  {
    id: '2',
    callsign: 'Марс',
    fullName: 'Петренко Петро Петрович',
    rank: 'Сержант',
    birthDate: '1995-08-23',
    serviceType: 'Контракт',
    tagNumber: '2456',
    unitId: '5',
    positionId: 'pos4',
    roleIds: ['role4', 'role5', 'role7'],
    status: 'Служить',
    militaryId: 'АА 234567',
    passport: 'КВ 876543',
    taxId: '2234234234',
    phone: '+38 098 234-56-78',
    address: 'Київ, вул Бгд 12',
    registrationAddress: 'Київ, вул Бгд 12',
    citizenship: 'Україна',
    bloodType: 'B (III) Rh+',
    recruitedBy: 'Печерський ТЦК',
    recruitedDate: '2021-09-01',
    education: [
      {
        id: 'edu2',
        institution: 'КПІ ім. Ігоря Сікорського',
        startYear: 2013,
        endYear: 2019,
        degree: 'Магістр',
        specialty: 'Комп\'ютерні мережі'
      }
    ],
    drivingLicense: {
      categories: ['B', 'C'],
      yearObtained: 2013,
      experience: 12
    },
    skills: [
      { id: 's3', name: 'Mikrotik RouterOS', level: 3, category: 'Мережі' },
      { id: 's4', name: 'VPN налаштування', level: 3, category: 'Мережі' },
      { id: 's5', name: 'Linux системи', level: 2, category: 'ІТ' }
    ],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-02-18T11:20:00Z'
  },
  {
    id: '3',
    callsign: 'Юпітер',
    fullName: 'Сидоренко Олексій Миколайович',
    rank: 'Капітан',
    birthDate: '1988-11-05',
    serviceType: 'Контракт',
    tagNumber: '1001',
    unitId: '4',
    positionId: 'pos1',
    roleIds: [],
    status: 'Служить',
    militaryId: 'АА 112233',
    passport: 'КВ 445566',
    taxId: '2345345345',
    phone: '+38 098 345-67-89',
    address: 'Київ, просп. Перемоги 50',
    registrationAddress: 'Київ, просп. Перемоги 50',
    citizenship: 'Україна',
    bloodType: 'O (I) Rh+',
    recruitedBy: 'Офіцерське училище',
    recruitedDate: '2010-06-01',
    education: [
      {
        id: 'edu3',
        institution: 'Національна академія сухопутних військ',
        startYear: 2006,
        endYear: 2010,
        degree: 'Магістр',
        specialty: 'Військове управління'
      }
    ],
    drivingLicense: {
      categories: ['B', 'C', 'D'],
      yearObtained: 2006,
      experience: 19
    },
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z'
  },
  {
    id: '4',
    callsign: 'Меркурій',
    fullName: 'Коваленко Андрій Сергійович',
    rank: 'Молодший сержант',
    birthDate: '1998-03-17',
    serviceType: 'Мобілізований',
    tagNumber: '3567',
    unitId: '7',
    positionId: 'pos8',
    roleIds: ['role12'],
    status: 'Служить',
    militaryId: 'АА 445566',
    passport: 'КВ 112233',
    taxId: '2456456456',
    phone: '+38 098 456-78-90',
    address: 'Київ, вул Деж 34',
    registrationAddress: 'Київ, вул Деж 34',
    citizenship: 'Україна',
    bloodType: 'AB (IV) Rh-',
    recruitedBy: 'Дніпровський ТЦК',
    recruitedDate: '2023-05-20',
    skills: [
      { id: 's6', name: 'Пайка електронних компонентів', level: 2, category: 'Ремонт' },
      { id: 's7', name: 'Діагностика радіостанцій', level: 2, category: 'Ремонт' }
    ],
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-02-22T16:45:00Z'
  },
  {
    id: '5',
    callsign: 'Венера',
    fullName: 'Шевченко Олена Володимирівна',
    rank: 'Старший лейтенант',
    birthDate: '1992-07-09',
    serviceType: 'Контракт',
    tagNumber: '1789',
    unitId: '6',
    positionId: 'pos7',
    roleIds: ['role11'],
    status: 'Служить',
    militaryId: 'АА 556677',
    passport: 'КВ 223344',
    taxId: '2567567567',
    phone: '+38 098 567-89-01',
    address: 'Київ, бульв. Лесі Українки 15',
    registrationAddress: 'Київ, бульв. Лесі Українки 15',
    citizenship: 'Україна',
    bloodType: 'A (II) Rh+',
    recruitedBy: 'Офіцерське училище',
    recruitedDate: '2014-08-01',
    education: [
      {
        id: 'edu4',
        institution: 'Національний технічний університет України',
        startYear: 2009,
        endYear: 2014,
        degree: 'Магістр',
        specialty: 'Інформаційна безпека'
      }
    ],
    drivingLicense: {
      categories: ['B'],
      yearObtained: 2010,
      experience: 15
    },
    clearances: ['Допуск до криптометодів/ключів'],
    skills: [
      { id: 's8', name: 'Криптографічні протоколи', level: 3, category: 'Криптозахист' },
      { id: 's9', name: 'Управління ключами', level: 3, category: 'Криптозахист' }
    ],
    createdAt: '2024-01-08T10:30:00Z',
    updatedAt: '2024-02-19T13:15:00Z'
  },
  {
    id: '6',
    callsign: 'Нептун',
    fullName: 'Мельник Василь Іванович',
    rank: 'Солдат',
    birthDate: '2000-12-25',
    serviceType: 'Мобілізований',
    tagNumber: '4678',
    unitId: '5',
    positionId: 'pos4',
    roleIds: ['role6'],
    status: 'Служить',
    militaryId: 'АА 667788',
    passport: 'КВ 334455',
    taxId: '2678678678',
    phone: '+38 098 678-90-12',
    address: 'Львів, вул Грушевського 22',
    registrationAddress: 'Львів, вул Грушевського 22',
    citizenship: 'Україна',
    bloodType: 'B (III) Rh+',
    recruitedBy: 'Львівський ТЦК',
    recruitedDate: '2023-08-10',
    skills: [
      { id: 's10', name: 'Налаштування Wi-Fi', level: 2, category: 'Мережі' },
      { id: 's11', name: 'Монтаж обладнання', level: 1, category: 'Мережі' }
    ],
    createdAt: '2024-01-25T14:00:00Z',
    updatedAt: '2024-02-21T09:30:00Z'
  },
  {
    id: '7',
    callsign: 'Сатурн',
    fullName: 'Іваненко Іван Іванович',
    rank: 'Старший сержант',
    birthDate: '1993-04-12',
    serviceType: 'Контракт',
    tagNumber: '1245',
    unitId: '8',
    positionId: 'pos3',
    roleIds: ['role1', 'role3'],
    status: 'Служить',
    militaryId: 'АА 123456',
    passport: 'КВ 987654',
    taxId: '2123123123',
    phone: '+38 098 123-45-67',
    additionalPhones: ['+38 098 123-45-68'],
    address: 'Київ, вул Абв 1',
    registrationAddress: 'Київ, вул Абв 2',
    citizenship: 'Україна',
    bloodType: 'A (II) Rh+',
    recruitedBy: 'Шевченківський ТЦК',
    recruitedDate: '2022-03-15',
    education: [
      {
        id: 'edu1',
        institution: 'ХНУРЕ',
        startYear: 2017,
        endYear: 2022,
        degree: 'Магістр',
        specialty: 'Телекомунікації'
      }
    ],
    drivingLicense: {
      categories: ['B'],
      yearObtained: 2005,
      experience: 20
    },
    family: {
      emergencyContact: {
        name: 'Іваненко Марія Петрівна',
        phone: '+38 098 111-22-33',
        relation: 'Дружина'
      }
    },
    skills: [
      { id: 's1', name: 'HF радіостанції', level: 3, category: 'Радіозв\'язок' },
      { id: 's2', name: 'Монтаж антен', level: 2, category: 'Радіозв\'язок' }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-20T14:30:00Z'
  },
  {
    id: '8',
    callsign: 'Марс',
    fullName: 'Петренко Петро Петрович',
    rank: 'Сержант',
    birthDate: '1995-08-23',
    serviceType: 'Контракт',
    tagNumber: '2456',
    unitId: '5',
    positionId: 'pos4',
    roleIds: ['role4', 'role5', 'role7'],
    status: 'Служить',
    militaryId: 'АА 234567',
    passport: 'КВ 876543',
    taxId: '2234234234',
    phone: '+38 098 234-56-78',
    address: 'Київ, вул Бгд 12',
    registrationAddress: 'Київ, вул Бгд 12',
    citizenship: 'Україна',
    bloodType: 'B (III) Rh+',
    recruitedBy: 'Печерський ТЦК',
    recruitedDate: '2021-09-01',
    education: [
      {
        id: 'edu2',
        institution: 'КПІ ім. Ігоря Сікорського',
        startYear: 2013,
        endYear: 2019,
        degree: 'Магістр',
        specialty: 'Комп\'ютерні мережі'
      }
    ],
    drivingLicense: {
      categories: ['B', 'C'],
      yearObtained: 2013,
      experience: 12
    },
    skills: [
      { id: 's3', name: 'Mikrotik RouterOS', level: 3, category: 'Мережі' },
      { id: 's4', name: 'VPN налаштування', level: 3, category: 'Мережі' },
      { id: 's5', name: 'Linux системи', level: 2, category: 'ІТ' }
    ],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-02-18T11:20:00Z'
  },
  {
    id: '9',
    callsign: 'Юпітер',
    fullName: 'Сидоренко Олексій Миколайович',
    rank: 'Капітан',
    birthDate: '1988-11-05',
    serviceType: 'Контракт',
    tagNumber: '1001',
    unitId: '4',
    positionId: 'pos1',
    roleIds: [],
    status: 'Служить',
    militaryId: 'АА 112233',
    passport: 'КВ 445566',
    taxId: '2345345345',
    phone: '+38 098 345-67-89',
    address: 'Київ, просп. Перемоги 50',
    registrationAddress: 'Київ, просп. Перемоги 50',
    citizenship: 'Україна',
    bloodType: 'O (I) Rh+',
    recruitedBy: 'Офіцерське училище',
    recruitedDate: '2010-06-01',
    education: [
      {
        id: 'edu3',
        institution: 'Національна академія сухопутних військ',
        startYear: 2006,
        endYear: 2010,
        degree: 'Магістр',
        specialty: 'Військове управління'
      }
    ],
    drivingLicense: {
      categories: ['B', 'C', 'D'],
      yearObtained: 2006,
      experience: 19
    },
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z'
  },
  {
    id: '10',
    callsign: 'Меркурій',
    fullName: 'Коваленко Андрій Сергійович',
    rank: 'Молодший сержант',
    birthDate: '1998-03-17',
    serviceType: 'Мобілізований',
    tagNumber: '3567',
    unitId: '7',
    positionId: 'pos8',
    roleIds: ['role12'],
    status: 'Служить',
    militaryId: 'АА 445566',
    passport: 'КВ 112233',
    taxId: '2456456456',
    phone: '+38 098 456-78-90',
    address: 'Київ, вул Деж 34',
    registrationAddress: 'Київ, вул Деж 34',
    citizenship: 'Україна',
    bloodType: 'AB (IV) Rh-',
    recruitedBy: 'Дніпровський ТЦК',
    recruitedDate: '2023-05-20',
    skills: [
      { id: 's6', name: 'Пайка електронних компонентів', level: 2, category: 'Ремонт' },
      { id: 's7', name: 'Діагностика радіостанцій', level: 2, category: 'Ремонт' }
    ],
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-02-22T16:45:00Z'
  },
  {
    id: '11',
    callsign: 'Венера',
    fullName: 'Шевченко Олена Володимирівна',
    rank: 'Старший лейтенант',
    birthDate: '1992-07-09',
    serviceType: 'Контракт',
    tagNumber: '1789',
    unitId: '6',
    positionId: 'pos7',
    roleIds: ['role11'],
    status: 'Служить',
    militaryId: 'АА 556677',
    passport: 'КВ 223344',
    taxId: '2567567567',
    phone: '+38 098 567-89-01',
    address: 'Київ, бульв. Лесі Українки 15',
    registrationAddress: 'Київ, бульв. Лесі Українки 15',
    citizenship: 'Україна',
    bloodType: 'A (II) Rh+',
    recruitedBy: 'Офіцерське училище',
    recruitedDate: '2014-08-01',
    education: [
      {
        id: 'edu4',
        institution: 'Національний технічний університет України',
        startYear: 2009,
        endYear: 2014,
        degree: 'Магістр',
        specialty: 'Інформаційна безпека'
      }
    ],
    drivingLicense: {
      categories: ['B'],
      yearObtained: 2010,
      experience: 15
    },
    clearances: ['Допуск до криптометодів/ключів'],
    skills: [
      { id: 's8', name: 'Криптографічні протоколи', level: 3, category: 'Криптозахист' },
      { id: 's9', name: 'Управління ключами', level: 3, category: 'Криптозахист' }
    ],
    createdAt: '2024-01-08T10:30:00Z',
    updatedAt: '2024-02-19T13:15:00Z'
  },
  {
    id: '12',
    callsign: 'Нептун',
    fullName: 'Мельник Василь Іванович',
    rank: 'Солдат',
    birthDate: '2000-12-25',
    serviceType: 'Мобілізований',
    tagNumber: '4678',
    unitId: '5',
    positionId: 'pos4',
    roleIds: ['role6'],
    status: 'Служить',
    militaryId: 'АА 667788',
    passport: 'КВ 334455',
    taxId: '2678678678',
    phone: '+38 098 678-90-12',
    address: 'Львів, вул Грушевського 22',
    registrationAddress: 'Львів, вул Грушевського 22',
    citizenship: 'Україна',
    bloodType: 'B (III) Rh+',
    recruitedBy: 'Львівський ТЦК',
    recruitedDate: '2023-08-10',
    skills: [
      { id: 's10', name: 'Налаштування Wi-Fi', level: 2, category: 'Мережі' },
      { id: 's11', name: 'Монтаж обладнання', level: 1, category: 'Мережі' }
    ],
    createdAt: '2024-01-25T14:00:00Z',
    updatedAt: '2024-02-21T09:30:00Z'
  }
];

// Допоміжні функції
export function getUnitName(unitId: string): string {
  const unit = organizationalUnits.find(u => u.id === unitId);
  return unit?.name || 'Невідомо';
}

export function getPositionName(positionId: string): string {
  const position = positions.find(p => p.id === positionId);
  return position?.name || 'Невідомо';
}

export function getRoleName(roleId: string): string {
  const role = roles.find(r => r.id === roleId);
  return role?.name || 'Невідомо';
}

export function getDirectionName(directionId: string): string {
  const direction = functionalDirections.find(d => d.id === directionId);
  return direction?.name || 'Невідомо';
}

// Функція для побудови ієрархії підрозділів
export function buildUnitHierarchy(units: OrganizationalUnit[]): OrganizationalUnit[] {
  const rootUnits = units.filter(u => !u.parentId);
  return rootUnits;
}

// Функція для отримання повного шляху підрозділу
export function getUnitPath(unitId: string, units: OrganizationalUnit[]): string {
  const path: string[] = [];
  let currentUnit = units.find(u => u.id === unitId);

  while (currentUnit) {
    path.unshift(currentUnit.abbreviation || currentUnit.name);
    currentUnit = units.find(u => u.id === currentUnit!.parentId);
  }

  return path.join(' → ');
}
