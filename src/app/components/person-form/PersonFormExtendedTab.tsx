import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { useLanguage } from '../../context/LanguageContext';

export function PersonFormExtendedTab() {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('form_extended_title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        {t('form_extended_coming_soon')}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
