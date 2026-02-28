import { Control, FieldErrors, Controller } from 'react-hook-form';
import { Person } from '../../types/personnel';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { useDictionaries } from '../../context/DictionariesContext';
import { useLanguage } from '../../context/LanguageContext';

interface PersonFormRolesCardProps {
    control: Control<Person>;
    errors: FieldErrors<Person>;
}

export function PersonFormRolesCard({ control, errors }: PersonFormRolesCardProps) {
    const { roles } = useDictionaries();
    const { t } = useLanguage();

    return (
        <Card className="shrink-0 w-full">
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
                                                    (field.value || []).filter((rid: string) => rid !== role.id)
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
    );
}
