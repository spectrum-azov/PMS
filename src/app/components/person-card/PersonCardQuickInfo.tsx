import { Person } from '../../types/personnel';
import { Card, CardContent } from '../ui/card';
import { Shield, Briefcase, Users, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PersonCardQuickInfoProps {
    person: Person;
    getUnitName: (unitId: string) => string;
    getPositionName: (positionId: string) => string;
}

export function PersonCardQuickInfo({ person, getUnitName, getPositionName }: PersonCardQuickInfoProps) {
    const { t } = useLanguage();

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">{t('card_rank')}</p>
                            <p className="font-medium text-foreground">{person.rank}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">{t('card_service_type_label')}</p>
                            <p className="font-medium text-foreground">{person.serviceType}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs text-muted-foreground">{t('card_unit_label')}</p>
                            <p className="font-medium text-foreground truncate">{getUnitName(person.unitId)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs text-muted-foreground">{t('card_position_label')}</p>
                            <p className="font-medium text-foreground truncate">{getPositionName(person.positionId)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
