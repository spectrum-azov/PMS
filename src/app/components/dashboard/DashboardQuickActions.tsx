import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../../context/LanguageContext';

export function DashboardQuickActions() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {t('dashboard_quick_actions')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        className="p-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-all text-center"
                        onClick={() => navigate('/personnel/new')}
                    >
                        <Users className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">{t('dashboard_add_person')}</p>
                    </button>
                    <button className="p-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-all text-center">
                        <Award className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">{t('dashboard_add_award')}</p>
                    </button>
                    <button className="p-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-all text-center">
                        <TrendingUp className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">{t('dashboard_generate_report')}</p>
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
