import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import { Person } from '../../types/personnel';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useDictionaries } from '../../context/DictionariesContext';
import { useLanguage } from '../../context/LanguageContext';

interface PersonFormServiceInfoCardProps {
    register: UseFormRegister<Person>;
    control: Control<Person>;
    errors: FieldErrors<Person>;
}

export function PersonFormServiceInfoCard({ register, control, errors }: PersonFormServiceInfoCardProps) {
    const { units, positions } = useDictionaries();
    const { t } = useLanguage();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('form_service')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-[3px]">
                        <Label htmlFor="serviceType">{t('form_service_type')}</Label>
                        {errors.serviceType && (
                            <span className="text-xs text-destructive font-medium">{errors.serviceType.message}</span>
                        )}
                    </div>
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
                </div>

                <div>
                    <Label htmlFor="tagNumber" className="mb-[3px]">{t('form_tag_number')}</Label>
                    <Input
                        id="tagNumber"
                        {...register('tagNumber')}
                        placeholder="1245"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-[3px]">
                        <Label htmlFor="unitId">{t('form_unit')}</Label>
                        {errors.unitId && (
                            <span className="text-xs text-destructive font-medium">{errors.unitId.message}</span>
                        )}
                    </div>
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
                </div>

                <div>
                    <div className="flex items-center justify-between mb-[3px]">
                        <Label htmlFor="positionId">{t('form_position')}</Label>
                        {errors.positionId && (
                            <span className="text-xs text-destructive font-medium">{errors.positionId.message}</span>
                        )}
                    </div>
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
                </div>

                <div>
                    <Label htmlFor="status" className="mb-[3px]">{t('form_status')}</Label>
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
    );
}
