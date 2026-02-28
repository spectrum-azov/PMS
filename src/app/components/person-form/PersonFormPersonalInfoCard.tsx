import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import { Person } from '../../types/personnel';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useDictionaries } from '../../context/DictionariesContext';
import { useLanguage } from '../../context/LanguageContext';

interface PersonFormPersonalInfoCardProps {
    register: UseFormRegister<Person>;
    control: Control<Person>;
    errors: FieldErrors<Person>;
    validateBirthDate: (value: string) => true | string;
}

export function PersonFormPersonalInfoCard({ register, control, errors, validateBirthDate }: PersonFormPersonalInfoCardProps) {
    const { ranks } = useDictionaries();
    const { t } = useLanguage();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('form_personal_info')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <div>
                    <Label htmlFor="callsign" className="mb-2">{t('form_callsign')}</Label>
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
                    <Label htmlFor="fullName" className="mb-2">{t('form_fullname')}</Label>
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
                    <Label htmlFor="rank" className="mb-2">{t('form_rank')}</Label>
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
                    <Label htmlFor="birthDate" className="mb-2">{t('form_birthdate')}</Label>
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
                    <Label htmlFor="citizenship" className="mb-2">{t('form_citizenship')}</Label>
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
