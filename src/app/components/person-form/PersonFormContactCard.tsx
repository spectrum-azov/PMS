import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import { Person } from '../../types/personnel';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { MaskedInput } from '../ui/masked-input';
import { useLanguage } from '../../context/LanguageContext';

const phonePattern = /^(?:\+?38)?0\d{9}$/;
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
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>{t('form_contact')}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Controller
                            name="phone"
                            control={control}
                            rules={{
                                required: t('common_required_field'),
                                pattern: {
                                    value: phonePattern,
                                    message: t('form_val_phone_format'),
                                },
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
                        <Label htmlFor="address" className="mb-2">{t('form_address')}</Label>
                        <Input
                            id="address"
                            {...register('address')}
                            placeholder="Київ, вул Абв 1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="registrationAddress" className="mb-2">{t('form_reg_address')}</Label>
                        <Input
                            id="registrationAddress"
                            {...register('registrationAddress')}
                            placeholder="Київ, вул Абв 2"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Documents */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>{t('form_documents')}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="militaryId" className="mb-2">{t('form_military_id')}</Label>
                        <Input
                            id="militaryId"
                            {...register('militaryId', {
                                validate: (v) =>
                                    !v || docPattern.test(v) || t('form_val_doc_format'),
                            })}
                            placeholder="АА 123456"
                        />
                        {errors.militaryId && (
                            <p className="text-sm text-red-600 mt-1">{errors.militaryId.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="passport" className="mb-2">{t('form_passport')}</Label>
                        <Input
                            id="passport"
                            {...register('passport', {
                                validate: (v) =>
                                    !v || docPattern.test(v) || t('form_val_doc_format'),
                            })}
                            placeholder="КВ 987654"
                        />
                        {errors.passport && (
                            <p className="text-sm text-red-600 mt-1">{errors.passport.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="taxId" className="mb-2">{t('form_tax_id')}</Label>
                        <Input
                            id="taxId"
                            {...register('taxId', {
                                validate: (v) => !v || /^\d{10}$/.test(v) || t('form_val_taxid_format'),
                            })}
                            placeholder="1231231230"
                        />
                        {errors.taxId && (
                            <p className="text-sm text-red-600 mt-1">{errors.taxId.message}</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
