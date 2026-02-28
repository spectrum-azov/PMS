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
                        <div className="mb-[3px]">
                            <Label htmlFor="address">{t('form_address')}</Label>
                        </div>
                        <Input
                            id="address"
                            {...register('address')}
                            placeholder="Київ, вул Абв 1"
                        />
                    </div>

                    <div>
                        <div className="mb-[3px]">
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
                        <Controller
                            name="militaryId"
                            control={control}
                            rules={{
                                validate: (v) => !v || docPattern.test(v) || t('form_val_doc_format'),
                            }}
                            render={({ field }) => (
                                <MaskedInput
                                    id="militaryId"
                                    label={t('form_military_id')}
                                    mask="@@ 000000"
                                    definitions={{ '@': /[А-ЯҐЄІЇA-Zа-яґєіїa-z]/ }}
                                    prepare={(str) => str.toUpperCase()}
                                    unmask={false}
                                    value={field.value}
                                    onAccept={(value) => field.onChange(value)}
                                    error={errors.militaryId?.message}
                                    placeholder="АА 123456"
                                />
                            )}
                        />
                    </div>

                    <div>
                        <Controller
                            name="passport"
                            control={control}
                            rules={{
                                validate: (v) => !v || docPattern.test(v) || t('form_val_doc_format'),
                            }}
                            render={({ field }) => (
                                <MaskedInput
                                    id="passport"
                                    label={t('form_passport')}
                                    mask="@@ 000000"
                                    definitions={{ '@': /[А-ЯҐЄІЇA-Zа-яґєіїa-z]/ }}
                                    prepare={(str) => str.toUpperCase()}
                                    unmask={false}
                                    value={field.value}
                                    onAccept={(value) => field.onChange(value)}
                                    error={errors.passport?.message}
                                    placeholder="КВ 987654"
                                />
                            )}
                        />
                    </div>

                    <div>
                        <Controller
                            name="taxId"
                            control={control}
                            rules={{
                                validate: (v) => !v || /^\d{10}$/.test(v) || t('form_val_taxid_format'),
                            }}
                            render={({ field }) => (
                                <MaskedInput
                                    id="taxId"
                                    label={t('form_tax_id')}
                                    mask="0000000000"
                                    value={field.value}
                                    onAccept={(value) => field.onChange(value)}
                                    error={errors.taxId?.message}
                                    placeholder="1231231230"
                                />
                            )}
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
