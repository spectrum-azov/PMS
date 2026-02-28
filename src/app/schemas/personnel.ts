import { z } from 'zod';

export const ServiceStatusSchema = z.enum(['Служить', 'Переведений', 'Звільнений']);
export const ServiceTypeSchema = z.enum(['Контракт', 'Мобілізований']);

export const PersonSchema = z.object({
    id: z.string().uuid().optional().or(z.string()), // Handles both UUID and custom IDs for mock
    callsign: z.string().min(2, 'Позивний занадто короткий'),
    fullName: z.string().min(3, 'ПІБ занадто коротке'),
    rank: z.string(),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Невірний формат дати (РРРР-ММ-ДД)'),
    serviceType: ServiceTypeSchema,
    tagNumber: z.string().optional(),
    unitId: z.string().min(1, 'Підрозділ обов\'язковий'),
    positionId: z.string().min(1, 'Посада обов\'язкова'),
    roleIds: z.array(z.string()),
    status: ServiceStatusSchema,
    phone: z.string().min(10, 'Телефон занадто короткий'),
    additionalPhones: z.array(z.string()).optional(),
    address: z.string().optional(),
    registrationAddress: z.string().optional(),
    citizenship: z.string().optional(),
    militaryId: z.string().optional(),
    passport: z.string().optional(),
    taxId: z.string().optional(),
    bloodType: z.string().optional(),
    recruitedBy: z.string().optional(),
    recruitedDate: z.string().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});

export const PersonnelFiltersSchema = z.object({
    search: z.string().optional(),
    unitId: z.string().optional(),
    positionId: z.string().optional(),
    status: ServiceStatusSchema.optional(),
    serviceType: ServiceTypeSchema.optional(),
    roleId: z.string().optional(),
});

export type PersonType = z.infer<typeof PersonSchema>;
export type PersonnelFiltersType = z.infer<typeof PersonnelFiltersSchema>;
