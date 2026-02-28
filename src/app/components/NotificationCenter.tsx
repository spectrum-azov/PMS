import { useNavigate } from 'react-router';
import { Bell, BellOff, Check, CheckCheck, Trash2, Info, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { useSignalRContext } from '../context/SignalRContext';
import { useLanguage } from '../context/LanguageContext';
import { AppNotification, NotificationSeverity } from '../types/notification';
import { cn } from './ui/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SEVERITY_ICON: Record<NotificationSeverity, React.ElementType> = {
    info: Info,
    warning: AlertTriangle,
    error: XCircle,
    success: CheckCircle2,
};

const SEVERITY_CLASS: Record<NotificationSeverity, string> = {
    info: 'text-blue-500',
    warning: 'text-yellow-500',
    error: 'text-destructive',
    success: 'text-green-500',
};

function formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Single notification row ──────────────────────────────────────────────────
function NotifRow({ notif, onRead }: { notif: AppNotification; onRead: (id: string) => void }) {
    const navigate = useNavigate();
    const Icon = SEVERITY_ICON[notif.severity];

    const handleClick = () => {
        onRead(notif.id);
        if (notif.link) navigate(notif.link);
    };

    return (
        <button
            id={`notif-${notif.id}`}
            onClick={handleClick}
            className={cn(
                'w-full text-left px-3 py-2.5 flex gap-2.5 hover:bg-accent/60 transition-colors rounded',
                !notif.read && 'bg-accent/30'
            )}
        >
            <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', SEVERITY_CLASS[notif.severity])} />
            <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium leading-tight truncate', !notif.read && 'font-semibold')}>
                    {notif.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.body}</p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0 pt-0.5">{formatTime(notif.timestamp)}</span>
        </button>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function NotificationCenter() {
    const { notifications, unreadCount, markRead, markAllRead, clearAll, push } = useSignalRContext();
    const { t } = useLanguage();

    const handleEnablePush = async () => {
        await push.requestPermission();
        if (push.permission === 'granted') await push.subscribe();
    };

    const handleDisablePush = async () => {
        await push.unsubscribe();
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id="notification-center-trigger"
                    variant="ghost"
                    size="sm"
                    className="relative px-2"
                    aria-label={t('notif_center_title')}
                >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                        <Badge
                            id="notification-unread-badge"
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] flex items-center justify-center"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80 p-0">
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b">
                    <span className="text-sm font-semibold">{t('notif_center_title')}</span>
                    <div className="flex gap-1">
                        {unreadCount > 0 && (
                            <Button
                                id="notif-mark-all-read"
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={markAllRead}
                                title={t('notif_mark_all_read')}
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                            </Button>
                        )}
                        {notifications.length > 0 && (
                            <Button
                                id="notif-clear-all"
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                                onClick={clearAll}
                                title={t('notif_clear_all')}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* List */}
                <ScrollArea className="max-h-80">
                    {notifications.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            {t('notif_empty')}
                        </div>
                    ) : (
                        <div className="p-1 space-y-0.5">
                            {notifications.map((n) => (
                                <NotifRow key={n.id} notif={n} onRead={markRead} />
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {/* Push toggle footer */}
                <Separator />
                <div className="px-3 py-2">
                    {push.permission === 'unsupported' ? null : push.isSubscribed ? (
                        <Button
                            id="notif-disable-push"
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs text-muted-foreground gap-2"
                            onClick={handleDisablePush}
                        >
                            <BellOff className="w-3.5 h-3.5" />
                            {t('notif_push_enabled')}
                            <Check className="w-3 h-3 ml-auto text-green-500" />
                        </Button>
                    ) : (
                        <Button
                            id="notif-enable-push"
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs gap-2"
                            onClick={handleEnablePush}
                            disabled={push.permission === 'denied'}
                        >
                            <Bell className="w-3.5 h-3.5" />
                            {push.permission === 'denied'
                                ? t('push_denied').slice(0, 40) + '…'
                                : t('notif_enable_push')}
                        </Button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
