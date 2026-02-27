import { Person } from '../../types/personnel';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { useLanguage } from '../../context/LanguageContext';

interface PersonCardDocumentsTabProps {
    person: Person;
}

export function PersonCardDocumentsTab({ person }: PersonCardDocumentsTabProps) {
    const { t } = useLanguage();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('card_documents')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {person.militaryId && (
                    <>
                        <div>
                            <p className="text-sm text-muted-foreground">{t('card_military_id')}</p>
                            <p className="font-medium font-mono">{person.militaryId}</p>
                        </div>
                        <Separator />
                    </>
                )}
                {person.passport && (
                    <>
                        <div>
                            <p className="text-sm text-muted-foreground">{t('card_passport')}</p>
                            <p className="font-medium font-mono">{person.passport}</p>
                        </div>
                        <Separator />
                    </>
                )}
                {person.taxId && (
                    <div>
                        <p className="text-sm text-muted-foreground">{t('card_tax_id')}</p>
                        <p className="font-medium font-mono">{person.taxId}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
