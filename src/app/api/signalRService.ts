import {
    HubConnectionBuilder,
    HubConnection,
    LogLevel,
    HubConnectionState,
} from '@microsoft/signalr';

const HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL ?? '/hubs/notifications';

// ─── Event name constants ─────────────────────────────────────────────────────
export const HUB_EVENTS = {
    PERSONNEL_CREATED: 'PersonnelCreated',
    PERSONNEL_UPDATED: 'PersonnelUpdated',
    PERSONNEL_DELETED: 'PersonnelDeleted',
    SYSTEM_ALERT: 'SystemAlert',
} as const;

export type HubEventName = (typeof HUB_EVENTS)[keyof typeof HUB_EVENTS];

// ─── Singleton connection builder ─────────────────────────────────────────────
class SignalRService {
    private connection: HubConnection;

    constructor() {
        this.connection = new HubConnectionBuilder()
            .withUrl(HUB_URL)
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .configureLogging(LogLevel.Warning)
            .build();
    }

    async start(): Promise<void> {
        if (this.connection.state !== HubConnectionState.Disconnected) return;
        try {
            await this.connection.start();
            console.info('[SignalR] Connected to', HUB_URL);
        } catch (err) {
            console.warn('[SignalR] Could not connect (backend may not be running):', err);
        }
    }

    async stop(): Promise<void> {
        try {
            await this.connection.stop();
        } catch {
            // ignore stop errors
        }
    }

    on<T>(event: HubEventName, callback: (payload: T) => void): void {
        this.connection.on(event, callback);
    }

    off<T>(event: HubEventName, callback: (payload: T) => void): void {
        this.connection.off(event, callback);
    }

    get state(): HubConnectionState {
        return this.connection.state;
    }
}

/** App-wide SignalR singleton */
export const signalRService = new SignalRService();
