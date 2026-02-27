import { Person } from '../../types/personnel';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PersonCardAwardsTabProps {
    person: Person;
    formatDate: (date: string) => string;
}

export function PersonCardAwardsTab({ person, formatDate }: PersonCardAwardsTabProps) {
    const { t } = useLanguage();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    {t('card_awards')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {person.awards && person.awards.length > 0 ? (
                    <div className="space-y-4">
                        {person.awards.map((award: {
                            id: string; name: string; reason: string; level: string; dateAwarded: string
                        }) => (
                            <div key={award.id} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-yellow-200 dark:border-yellow-900/50">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium text-foreground">{award.name}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{award.reason}</p>
                                        <div className="flex items-center gap-3 mt-3">
                                            <Badge>{award.level}</Badge>
                                            <span className="text-xs text-muted-foreground">{formatDate(award.dateAwarded)}</span>
                                        </div>
                                    </div>
                                    <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-8">{t('card_no_awards')}</p>
                )}
            </CardContent>
        </Card>
    );
}
