import { z } from 'zod';

// ─── Severity ────────────────────────────────────────────────────────────────
export const NotificationSeveritySchema = z.enum(['info', 'warning', 'error', 'success']);
export type NotificationSeverity = z.infer<typeof NotificationSeveritySchema>;

// ─── AppNotification ──────────────────────────────────────────────────────────
export const AppNotificationSchema = z.object({
    id: z.string(),
    title: z.string(),
    body: z.string(),
    severity: NotificationSeveritySchema,
    timestamp: z.string(), // ISO-8601
    read: z.boolean(),
    /** Optional hash route deep-link, e.g. "/personnel/123" */
    link: z.string().optional(),
});

export type AppNotification = z.infer<typeof AppNotificationSchema>;

// ─── Hub event payloads ───────────────────────────────────────────────────────
export const PersonnelEventPayloadSchema = z.object({
    id: z.string(),
    fullName: z.string(),
    callsign: z.string().optional(),
    changes: z.record(z.string(), z.unknown()).optional(),
});
export type PersonnelEventPayload = z.infer<typeof PersonnelEventPayloadSchema>;

export const SystemAlertPayloadSchema = z.object({
    title: z.string(),
    body: z.string(),
    severity: NotificationSeveritySchema,
});
export type SystemAlertPayload = z.infer<typeof SystemAlertPayloadSchema>;
