import { Person } from '../../types/personnel';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Phone, MapPin } from 'lucide-react';
import { formatPhoneNumber } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

interface PersonCardGeneralTabProps {
    person: Person;
    formatDate: (date: string) => string;
    getUnitName: (unitId: string) => string;
    getUnitPath: (unitId: string) => string;
    getPositionName: (positionId: string) => string;
    getRoleName: (roleId: string) => string;
}

export function PersonCardGeneralTab({
    person,
    formatDate,
    getUnitName,
    getUnitPath,
    getPositionName,
    getRoleName
}: PersonCardGeneralTabProps) {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Info */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>{t('card_personal_info')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <p className="text-sm text-muted-foreground">{t('card_fullname')}</p>
                            <p className="font-medium">{`${person.lastName} ${person.firstName} ${person.middleName}`}</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm text-muted-foreground">{t('card_callsign')}</p>
                            <p className="font-medium font-mono text-primary">{person.callsign}</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm text-muted-foreground">{t('card_birthdate')}</p>
                            <p className="font-medium">{formatDate(person.birthDate)}</p>
                        </div>
                        <Separator />
                        {person.bloodType && (
                            <>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('card_blood_type')}</p>
                                    <p className="font-medium">{person.bloodType}</p>
                                </div>
                                <Separator />
                            </>
                        )}
                        <div>
                            <p className="text-sm text-muted-foreground">{t('card_citizenship')}</p>
                            <p className="font-medium">{person.citizenship || t('card_not_specified')}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Service Info */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>{t('card_service')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <p className="text-sm text-muted-foreground">{t('card_military_rank')}</p>
                            <p className="font-medium">{person.rank}</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm text-muted-foreground">{t('card_service_type_label')}</p>
                            <Badge variant={person.serviceType === 'Контракт' ? 'default' : 'secondary'}>{person.serviceType}</Badge>
                        </div>
                        <Separator />
                        {person.tagNumber && (
                            <>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('card_tag_number')}</p>
                                    <p className="font-medium font-mono">{person.tagNumber}</p>
                                </div>
                                <Separator />
                            </>
                        )}
                        {person.recruitedBy && (
                            <>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('card_recruited_by')}</p>
                                    <p className="font-medium">{person.recruitedBy}</p>
                                </div>
                                <Separator />
                            </>
                        )}
                        {person.recruitedDate && (
                            <div>
                                <p className="text-sm text-muted-foreground">{t('card_recruited_date')}</p>
                                <p className="font-medium">{formatDate(person.recruitedDate)}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Organization */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>{t('card_org')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <p className="text-sm text-muted-foreground">{t('card_unit_label')}</p>
                            <p className="font-medium">{getUnitName(person.unitId)}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {getUnitPath(person.unitId)}
                            </p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm text-muted-foreground">{t('card_position_label')}</p>
                            <p className="font-medium">{getPositionName(person.positionId)}</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm text-muted-foreground">{t('card_roles')}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {person.roleIds.map((roleId: string) => (
                                    <Badge key={roleId} variant="outline">
                                        {getRoleName(roleId)}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Contact Info */}
            <Card className="w-full shrink-0">
                <CardHeader>
                    <CardTitle>{t('card_contact')}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phones Col */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">{t('card_primary_phone')}</p>
                                <p className="font-medium font-mono">{formatPhoneNumber(person.phone)}</p>
                            </div>
                        </div>
                        {person.additionalPhones && person.additionalPhones.length > 0 && (
                            <>
                                <Separator />
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('card_additional_phones')}</p>
                                        {person.additionalPhones.map((phone: string, idx: number) => (
                                            <p key={idx} className="font-medium font-mono">{formatPhoneNumber(phone)}</p>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Addresses Col */}
                    <div className="space-y-4">
                        {person.address && (
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('card_address')}</p>
                                    <p className="font-medium">{person.address}</p>
                                </div>
                            </div>
                        )}
                        {person.registrationAddress && (
                            <>
                                {person.address && <Separator />}
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('card_reg_address')}</p>
                                        <p className="font-medium">{person.registrationAddress}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
