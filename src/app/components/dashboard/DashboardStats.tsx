import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, UserCheck, UserX, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { DashboardData } from '../../api/types';

interface DashboardStatsProps {
    data: DashboardData;
}

export function DashboardStats({ data }: DashboardStatsProps) {
    const { t } = useLanguage();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t('dashboard_total_personnel')}
                    </CardTitle>
                    <Users className="w-5 h-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">{data.totalPersonnel}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                        {data.activePersonnel} {t('dashboard_active')}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t('dashboard_contract')}
                    </CardTitle>
                    <UserCheck className="w-5 h-5 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">{data.contractPersonnel}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                        {data.totalPersonnel > 0
                            ? Math.round((data.contractPersonnel / data.totalPersonnel) * 100)
                            : 0}{t('dashboard_pct_of_total')}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t('dashboard_mobilized')}
                    </CardTitle>
                    <UserX className="w-5 h-5 text-orange-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">{data.mobilizedPersonnel}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                        {data.totalPersonnel > 0
                            ? Math.round((data.mobilizedPersonnel / data.totalPersonnel) * 100)
                            : 0}{t('dashboard_pct_of_total')}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t('dashboard_with_awards')}
                    </CardTitle>
                    <Award className="w-5 h-5 text-yellow-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">{data.withAwards}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                        {t('dashboard_awarded_soldiers')}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
