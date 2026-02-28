import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Person } from '../../types/personnel';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';


import { useLanguage } from '../../context/LanguageContext';

interface PersonFormPersonalInfoCardProps {
    register: UseFormRegister<Person>;

    errors: FieldErrors<Person>;
    validateBirthDate: (value: string) => true | string;
}

export function PersonFormPersonalInfoCard({ register, errors, validateBirthDate }: PersonFormPersonalInfoCardProps) {

    const { t } = useLanguage();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('form_personal_info')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-[3px]">
                        <Label htmlFor="callsign">{t('form_callsign')}</Label>
                        {errors.callsign && (
                            <span className="text-xs text-destructive font-medium">{errors.callsign.message}</span>
                        )}
                    </div>
                    <Input
                        id="callsign"
                        {...register('callsign', {
                            required: t('common_required_field'),
                            minLength: { value: 2, message: t('form_val_min2') },
                        })}
                        placeholder="Сатурн"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-[3px]">
                        <Label htmlFor="lastName">Прізвище</Label>
                        {errors.lastName && (
                            <span className="text-xs text-destructive font-medium">{errors.lastName.message}</span>
                        )}
                    </div>
                    <Input
                        id="lastName"
                        {...register('lastName', {
                            required: t('common_required_field'),
                        })}
                        placeholder="Іваненко"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-[3px]">
                        <Label htmlFor="firstName">Ім'я</Label>
                        {errors.firstName && (
                            <span className="text-xs text-destructive font-medium">{errors.firstName.message}</span>
                        )}
                    </div>
                    <Input
                        id="firstName"
                        {...register('firstName', {
                            required: t('common_required_field'),
                        })}
                        placeholder="Іван"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-[3px]">
                        <Label htmlFor="middleName">По батькові</Label>
                        {errors.middleName && (
                            <span className="text-xs text-destructive font-medium">{errors.middleName.message}</span>
                        )}
                    </div>
                    <Input
                        id="middleName"
                        {...register('middleName', {
                            required: t('common_required_field'),
                        })}
                        placeholder="Іванович"
                    />
                </div>



                <div>
                    <div className="flex items-center justify-between mb-[3px]">
                        <Label htmlFor="birthDate">{t('form_birthdate')}</Label>
                        {errors.birthDate && (
                            <span className="text-xs text-destructive font-medium">{errors.birthDate.message}</span>
                        )}
                    </div>
                    <Input
                        id="birthDate"
                        type="date"
                        {...register('birthDate', {
                            required: t('common_required_field'),
                            validate: validateBirthDate,
                        })}
                    />
                </div>

                <div>
                    <Label htmlFor="citizenship" className="mb-[3px]">{t('form_citizenship')}</Label>
                    <Input
                        id="citizenship"
                        {...register('citizenship')}
                        placeholder="Україна"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
