
import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { useLanguage } from '../../context/LanguageContext';

export function DashboardLoading() {
    const { t } = useLanguage();

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-3xl font-semibold text-foreground">{t('dashboard_title')}</h2>
                <p className="text-muted-foreground mt-1">{t('dashboard_subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-5 w-5 rounded" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-4 w-24" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                    <Card key={i}>
                        <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2, 3].map((j) => (
                                <div key={j}>
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-2 w-full rounded-full" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
