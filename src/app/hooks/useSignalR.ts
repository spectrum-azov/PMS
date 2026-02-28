import { useEffect, useCallback } from 'react';
import { signalRService, HUB_EVENTS } from '../api/signalRService';
import {
    PersonnelEventPayloadSchema,
    SystemAlertPayloadSchema,
    AppNotification,
} from '../types/notification';

type AddNotification = (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;

/**
 * Connects to the SignalR hub on mount, registers typed event listeners,
 * and dispatches validated AppNotification objects via the addNotification callback.
 */
export function useSignalR(addNotification: AddNotification) {
    const handlePersonnelCreated = useCallback(
        (raw: unknown) => {
            const result = PersonnelEventPayloadSchema.safeParse(raw);
            if (!result.success) return;
            const { fullName, callsign, id } = result.data;
            addNotification({
                title: 'Доданий особовий склад',
                body: `${callsign ? `[${callsign}] ` : ''}${fullName} доданий до реєстру`,
                severity: 'success',
                link: `/personnel/${id}`,
            });
        },
        [addNotification]
    );

    const handlePersonnelUpdated = useCallback(
        (raw: unknown) => {
            const result = PersonnelEventPayloadSchema.safeParse(raw);
            if (!result.success) return;
            const { fullName, callsign, id } = result.data;
            addNotification({
                title: 'Оновлено особовий склад',
                body: `${callsign ? `[${callsign}] ` : ''}${fullName} — запис оновлено`,
                severity: 'info',
                link: `/personnel/${id}`,
            });
        },
        [addNotification]
    );

    const handlePersonnelDeleted = useCallback(
        (raw: unknown) => {
            const result = PersonnelEventPayloadSchema.safeParse(raw);
            if (!result.success) return;
            const { fullName, callsign } = result.data;
            addNotification({
                title: 'Видалено з реєстру',
                body: `${callsign ? `[${callsign}] ` : ''}${fullName} видалений з реєстру`,
                severity: 'warning',
            });
        },
        [addNotification]
    );

    const handleSystemAlert = useCallback(
        (raw: unknown) => {
            const result = SystemAlertPayloadSchema.safeParse(raw);
            if (!result.success) return;
            addNotification(result.data);
        },
        [addNotification]
    );

    useEffect(() => {
        signalRService.start();

        signalRService.on(HUB_EVENTS.PERSONNEL_CREATED, handlePersonnelCreated);
        signalRService.on(HUB_EVENTS.PERSONNEL_UPDATED, handlePersonnelUpdated);
        signalRService.on(HUB_EVENTS.PERSONNEL_DELETED, handlePersonnelDeleted);
        signalRService.on(HUB_EVENTS.SYSTEM_ALERT, handleSystemAlert);

        return () => {
            signalRService.off(HUB_EVENTS.PERSONNEL_CREATED, handlePersonnelCreated);
            signalRService.off(HUB_EVENTS.PERSONNEL_UPDATED, handlePersonnelUpdated);
            signalRService.off(HUB_EVENTS.PERSONNEL_DELETED, handlePersonnelDeleted);
            signalRService.off(HUB_EVENTS.SYSTEM_ALERT, handleSystemAlert);
            signalRService.stop();
        };
    }, [handlePersonnelCreated, handlePersonnelUpdated, handlePersonnelDeleted, handleSystemAlert]);
}
