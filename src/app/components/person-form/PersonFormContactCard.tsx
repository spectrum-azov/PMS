import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import { Person } from '../../types/personnel';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { MaskedInput } from '../ui/masked-input';
import { useLanguage } from '../../context/LanguageContext';

const docPattern = /^[А-ЯҐЄІЇA-Z]{2}\s\d{6}$/i;

interface PersonFormContactCardProps {
    register: UseFormRegister<Person>;
    control: Control<Person>;
    errors: FieldErrors<Person>;
}

export function PersonFormContactCard({ register, control, errors }: PersonFormContactCardProps) {
    const { t } = useLanguage();

    return (
        <>
            {/* Contact Info */}
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>{t('form_contact')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Controller
                            name="phone"
                            control={control}
                            rules={{
                                required: t('common_required_field'),
                                validate: (v) => {
                                    if (!v) return true;
                                    const digits = v.replace(/\D/g, '');
                                    // if it's 10 digits (098...), or 12 digits (38098...)
                                    if (digits.length === 10 || digits.length === 12) return true;
                                    return t('form_val_phone_format');
                                }
                            }}
                            render={({ field }) => (
                                <MaskedInput
                                    id="phone"
                                    label={t('form_phone')}
                                    mask="+38 (000) 000-00-00"
                                    value={field.value}
                                    onAccept={(value) => {
                                        field.onChange(value);
                                    }}
                                    error={errors.phone?.message}
                                    placeholder="+38 (0__) ___-__-__"
                                />
                            )}
                        />
                    </div>

                    <div>
                        <div className="mb-2">
                            <Label htmlFor="address">{t('form_address')}</Label>
                        </div>
                        <Input
                            id="address"
                            {...register('address')}
                            placeholder="Київ, вул Абв 1"
                        />
                    </div>

                    <div>
                        <div className="mb-2">
                            <Label htmlFor="registrationAddress">{t('form_reg_address')}</Label>
                        </div>
                        <Input
                            id="registrationAddress"
                            {...register('registrationAddress')}
                            placeholder="Київ, вул Абв 2"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Documents */}
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>{t('form_documents')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4   ">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="militaryId">{t('form_military_id')}</Label>
                            {errors.militaryId && (
                                <span className="text-xs text-destructive font-medium">{errors.militaryId.message}</span>
                            )}
                        </div>
                        <Input
                            id="militaryId"
                            {...register('militaryId', {
                                validate: (v) =>
                                    !v || docPattern.test(v) || t('form_val_doc_format'),
                            })}
                            placeholder="АА 123456"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="passport">{t('form_passport')}</Label>
                            {errors.passport && (
                                <span className="text-xs text-destructive font-medium">{errors.passport.message}</span>
                            )}
                        </div>
                        <Input
                            id="passport"
                            {...register('passport', {
                                validate: (v) =>
                                    !v || docPattern.test(v) || t('form_val_doc_format'),
                            })}
                            placeholder="КВ 987654"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="taxId">{t('form_tax_id')}</Label>
                            {errors.taxId && (
                                <span className="text-xs text-destructive font-medium">{errors.taxId.message}</span>
                            )}
                        </div>
                        <Input
                            id="taxId"
                            {...register('taxId', {
                                validate: (v) => !v || /^\d{10}$/.test(v) || t('form_val_taxid_format'),
                            })}
                            placeholder="1231231230"
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
