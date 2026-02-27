import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import { Person } from '../../../types/personnel';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { MaskedInput } from '../ui/masked-input';
import { useDictionaries } from '../../context/DictionariesContext';
import { useLanguage } from '../../context/LanguageContext';

const phonePattern = /^(?:\+?38)?0\d{9}$/;
const docPattern = /^[А-ЯҐЄІЇA-Z]{2}\s\d{6}$/i;

interface PersonFormGeneralTabProps {
    register: UseFormRegister<Person>;
    control: Control<Person>;
    errors: FieldErrors<Person>;
    validateBirthDate: (value: string) => true | string;
}

export function PersonFormGeneralTab({ register, control, errors, validateBirthDate }: PersonFormGeneralTabProps) {
    const { units, positions, roles, ranks } = useDictionaries();
    const { t } = useLanguage();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Info */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('form_personal_info')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="callsign">{t('form_callsign')}</Label>
                        <Input
                            id="callsign"
                            {...register('callsign', {
                                required: t('common_required_field'),
                                minLength: { value: 2, message: t('form_val_min2') },
                            })}
                            placeholder="Сатурн"
                        />
                        {errors.callsign && (
                            <p className="text-sm text-red-600 mt-1">{errors.callsign.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="fullName">{t('form_fullname')}</Label>
                        <Input
                            id="fullName"
                            {...register('fullName', {
                                required: t('common_required_field'),
                                validate: (v) =>
                                    v.trim().split(/\s+/).length >= 2 || t('form_val_fullname'),
                            })}
                            placeholder="Іваненко Іван Іванович"
                        />
                        {errors.fullName && (
                            <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="rank">{t('form_rank')}</Label>
                        <Controller
                            name="rank"
                            control={control}
                            rules={{ required: t('common_required_field') }}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('form_select_rank')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ranks.map((rank) => (
                                            <SelectItem key={rank.id} value={rank.name}>
                                                {rank.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.rank && (
                            <p className="text-sm text-red-600 mt-1">{errors.rank.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="birthDate">{t('form_birthdate')}</Label>
                        <Input
                            id="birthDate"
                            type="date"
                            {...register('birthDate', {
                                required: t('common_required_field'),
                                validate: validateBirthDate,
                            })}
                        />
                        {errors.birthDate && (
                            <p className="text-sm text-red-600 mt-1">{errors.birthDate.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="citizenship">{t('form_citizenship')}</Label>
                        <Input
                            id="citizenship"
                            {...register('citizenship')}
                            placeholder="Україна"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Service Info */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('form_service')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="serviceType">{t('form_service_type')}</Label>
                        <Controller
                            name="serviceType"
                            control={control}
                            rules={{ required: t('common_required_field') }}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Контракт">{t('form_service_contract')}</SelectItem>
                                        <SelectItem value="Мобілізований">{t('form_service_mobilized')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.serviceType && (
                            <p className="text-sm text-red-600 mt-1">{errors.serviceType.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="tagNumber">{t('form_tag_number')}</Label>
                        <Input
                            id="tagNumber"
                            {...register('tagNumber')}
                            placeholder="1245"
                        />
                    </div>

                    <div>
                        <Label htmlFor="unitId">{t('form_unit')}</Label>
                        <Controller
                            name="unitId"
                            control={control}
                            rules={{ required: t('form_val_select_unit') }}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('form_select_unit')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units.map((unit) => (
                                            <SelectItem key={unit.id} value={unit.id}>
                                                {unit.abbreviation} - {unit.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.unitId && (
                            <p className="text-sm text-red-600 mt-1">{errors.unitId.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="positionId">{t('form_position')}</Label>
                        <Controller
                            name="positionId"
                            control={control}
                            rules={{ required: t('form_val_select_position') }}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('form_select_position')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {positions.map((position) => (
                                            <SelectItem key={position.id} value={position.id}>
                                                {position.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.positionId && (
                            <p className="text-sm text-red-600 mt-1">{errors.positionId.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="status">{t('form_status')}</Label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Служить">{t('form_status_serving')}</SelectItem>
                                        <SelectItem value="Переведений">{t('form_status_transferred')}</SelectItem>
                                        <SelectItem value="Звільнений">{t('form_status_discharged')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Roles */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>{t('form_roles')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Controller
                        name="roleIds"
                        control={control}
                        rules={{ validate: (v) => (v && v.length > 0) || t('form_roles_required') }}
                        render={({ field }) => (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {roles.map((role) => (
                                    <div key={role.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={role.id}
                                            checked={field.value?.includes(role.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    field.onChange([...(field.value || []), role.id]);
                                                } else {
                                                    field.onChange(
                                                        (field.value || []).filter((rid) => rid !== role.id)
                                                    );
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor={role.id}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {role.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                    {errors.roleIds && (
                        <p className="text-sm text-red-600 mt-2">{errors.roleIds.message}</p>
                    )}
                </CardContent>
            </Card>

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
                        <Label htmlFor="address">{t('form_address')}</Label>
                        <Input
                            id="address"
                            {...register('address')}
                            placeholder="Київ, вул Абв 1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="registrationAddress">{t('form_reg_address')}</Label>
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
                        <Label htmlFor="militaryId">{t('form_military_id')}</Label>
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
                        <Label htmlFor="passport">{t('form_passport')}</Label>
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
                        <Label htmlFor="taxId">{t('form_tax_id')}</Label>
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
        </div>
    );
}
