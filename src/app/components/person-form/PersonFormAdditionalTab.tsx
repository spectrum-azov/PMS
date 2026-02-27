import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import { Person } from '../../types/personnel';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { MaskedInput } from '../ui/masked-input';
import { useLanguage } from '../../context/LanguageContext';

const phonePattern = /^(?:\+?38)?0\d{9}$/;

interface PersonFormAdditionalTabProps {
    register: UseFormRegister<Person>;
    control: Control<Person>;
    errors: FieldErrors<Person>;
}

export function PersonFormAdditionalTab({ register, control, errors }: PersonFormAdditionalTabProps) {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('form_additional_info')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="bloodType">{t('form_blood_type')}</Label>
                            <Input
                                id="bloodType"
                                {...register('bloodType')}
                                placeholder="A (II) Rh+"
                            />
                        </div>

                        <div>
                            <Label htmlFor="recruitedBy">{t('form_recruited_by')}</Label>
                            <Input
                                id="recruitedBy"
                                {...register('recruitedBy')}
                                placeholder="Шевченківський ТЦК"
                            />
                        </div>

                        <div>
                            <Label htmlFor="recruitedDate">{t('form_recruited_date')}</Label>
                            <Input
                                id="recruitedDate"
                                type="date"
                                {...register('recruitedDate')}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('form_emergency_contact')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="emergencyContactName">{t('form_ec_name')}</Label>
                            <Input
                                id="emergencyContactName"
                                {...register('family.emergencyContact.name')}
                                placeholder="Іваненко Марія Петрівна"
                            />
                        </div>

                        <div>
                            <Controller
                                name="family.emergencyContact.phone"
                                control={control}
                                rules={{
                                    validate: (v) =>
                                        !v || phonePattern.test(v) || t('form_val_phone_format'),
                                }}
                                render={({ field }) => (
                                    <MaskedInput
                                        id="emergencyContactPhone"
                                        label={t('form_ec_phone')}
                                        mask="+38 (000) 000-00-00"
                                        value={field.value}
                                        onAccept={(value) => {
                                            field.onChange(value);
                                        }}
                                        error={errors.family?.emergencyContact?.phone?.message}
                                        placeholder="+38 (0__) ___-__-__"
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Label htmlFor="emergencyContactRelation">{t('form_ec_relation')}</Label>
                            <Input
                                id="emergencyContactRelation"
                                {...register('family.emergencyContact.relation')}
                                placeholder="Дружина"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('form_education')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        {t('form_education_coming_soon')}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
