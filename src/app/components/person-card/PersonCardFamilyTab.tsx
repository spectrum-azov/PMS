import { Person } from '../../types/personnel';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { Heart } from 'lucide-react';
import { formatPhoneNumber } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

interface PersonCardFamilyTabProps {
    person: Person;
}

export function PersonCardFamilyTab({ person }: PersonCardFamilyTabProps) {
    const { t } = useLanguage();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    {t('card_family')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {person.family?.emergencyContact ? (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">{t('card_ec_name')}</p>
                            <p className="font-medium">{person.family.emergencyContact.name}</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm text-muted-foreground">{t('card_ec_phone')}</p>
                            <p className="font-medium font-mono">{formatPhoneNumber(person.family.emergencyContact.phone)}</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm text-muted-foreground">{t('card_ec_relation')}</p>
                            <p className="font-medium">{person.family.emergencyContact.relation}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-8">{t('card_no_emergency_contact')}</p>
                )}
            </CardContent>
        </Card>
    );
}
