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
            <CardContent className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
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
                    <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="fullName">{t('form_fullname')}</Label>
                        {errors.fullName && (
                            <span className="text-xs text-destructive font-medium">{errors.fullName.message}</span>
                        )}
                    </div>
                    <Input
                        id="fullName"
                        {...register('fullName', {
                            required: t('common_required_field'),
                            validate: (v) =>
                                v.trim().split(/\s+/).length >= 2 || t('form_val_fullname'),
                        })}
                        placeholder="Іваненко Іван Іванович"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="rank">{t('form_rank')}</Label>
                        {errors.rank && (
                            <span className="text-xs text-destructive font-medium">{errors.rank.message}</span>
                        )}
                    </div>
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
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
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
