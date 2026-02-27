import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useLanguage } from '../../context/LanguageContext';
import { DashboardData } from '../../api/types';

interface DashboardChartsProps {
    data: DashboardData;
}

export function DashboardCharts({ data }: DashboardChartsProps) {
    const { t } = useLanguage();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('dashboard_unit_distribution')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.unitStats.map((stat, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-foreground">
                                            {stat.abbreviation}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {stat.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-foreground">{stat.count}</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                        style={{ width: `${data.totalPersonnel > 0 ? (stat.count / data.totalPersonnel) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('dashboard_top5_positions')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.positionStats.map((stat, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-foreground">
                                            {stat.name}
                                        </span>
                                        <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded">
                                            {stat.category}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-foreground">{stat.count}</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full transition-all"
                                        style={{ width: `${data.totalPersonnel > 0 ? (stat.count / data.totalPersonnel) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
