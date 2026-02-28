import {
    createContext,
    useCallback,
    useContext,
    useReducer,
    ReactNode,
    useMemo,
} from 'react';
import { toast } from 'sonner';
import { AppNotification, NotificationSeverity } from '../types/notification';
import { useSignalR } from '../hooks/useSignalR';
import { useVapidPush } from '../hooks/useVapidPush';

// ─── State & Actions ──────────────────────────────────────────────────────────
interface State {
    notifications: AppNotification[];
}

type Action =
    | { type: 'ADD'; payload: AppNotification }
    | { type: 'MARK_READ'; id: string }
    | { type: 'MARK_ALL_READ' }
    | { type: 'CLEAR_ALL' };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'ADD':
            return { notifications: [action.payload, ...state.notifications].slice(0, 100) };
        case 'MARK_READ':
            return {
                notifications: state.notifications.map((n) =>
                    n.id === action.id ? { ...n, read: true } : n
                ),
            };
        case 'MARK_ALL_READ':
            return { notifications: state.notifications.map((n) => ({ ...n, read: true })) };
        case 'CLEAR_ALL':
            return { notifications: [] };
        default:
            return state;
    }
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface SignalRContextValue {
    notifications: AppNotification[];
    unreadCount: number;
    addNotification: (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
    markRead: (id: string) => void;
    markAllRead: () => void;
    clearAll: () => void;
    push: ReturnType<typeof useVapidPush>;
}

const SignalRContext = createContext<SignalRContextValue | null>(null);

const SEVERITY_TOAST: Record<NotificationSeverity, (msg: string, opts?: object) => void> = {
    success: (m, o) => toast.success(m, o),
    error: (m, o) => toast.error(m, o),
    warning: (m, o) => toast.warning(m, o),
    info: (m, o) => toast.info(m, o),
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export function SignalRProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, { notifications: [] });
    const push = useVapidPush();

    const addNotification = useCallback(
        async (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
            const notification: AppNotification = {
                ...n,
                id: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
                read: false,
            };
            dispatch({ type: 'ADD', payload: notification });

            // In-app toast
            SEVERITY_TOAST[notification.severity](notification.title, {
                description: notification.body,
            });

            // OS-level push when tab is hidden
            if (document.hidden) {
                await push.showNotification(notification.title, {
                    body: notification.body,
                    data: { url: notification.link ?? '/' },
                    icon: '/icons/icon-192.png',
                    badge: '/icons/badge-72-2.png',
                });
            }
        },
        [push]
    );

    useSignalR(addNotification);

    const unreadCount = useMemo(
        () => state.notifications.filter((n) => !n.read).length,
        [state.notifications]
    );

    const markRead = useCallback((id: string) => dispatch({ type: 'MARK_READ', id }), []);
    const markAllRead = useCallback(() => dispatch({ type: 'MARK_ALL_READ' }), []);
    const clearAll = useCallback(() => dispatch({ type: 'CLEAR_ALL' }), []);

    const value = useMemo(
        () => ({ notifications: state.notifications, unreadCount, addNotification, markRead, markAllRead, clearAll, push }),
        [state.notifications, unreadCount, addNotification, markRead, markAllRead, clearAll, push]
    );

    return <SignalRContext.Provider value={value}>{children}</SignalRContext.Provider>;
}

export function useSignalRContext(): SignalRContextValue {
    const ctx = useContext(SignalRContext);
    if (!ctx) throw new Error('useSignalRContext must be used within SignalRProvider');
    return ctx;
}
