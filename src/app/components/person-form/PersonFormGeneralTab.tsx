import { UseFormRegister, Control, FieldErrors } from 'react-hook-form';
import { Person } from '../../types/personnel';
import { PersonFormPersonalInfoCard } from './PersonFormPersonalInfoCard';
import { PersonFormServiceInfoCard } from './PersonFormServiceInfoCard';
import { PersonFormRolesCard } from './PersonFormRolesCard';
import { PersonFormContactCard } from './PersonFormContactCard';

interface PersonFormGeneralTabProps {
    register: UseFormRegister<Person>;
    control: Control<Person>;
    errors: FieldErrors<Person>;
    validateBirthDate: (value: string) => true | string;
}

export function PersonFormGeneralTab({ register, control, errors, validateBirthDate }: PersonFormGeneralTabProps) {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="h-full">
                    <PersonFormPersonalInfoCard
                        register={register}
                        control={control}
                        errors={errors}
                        validateBirthDate={validateBirthDate}
                    />
                </div>

                <div className="h-full">
                    <PersonFormServiceInfoCard
                        register={register}
                        control={control}
                        errors={errors}
                    />
                </div>

                <PersonFormContactCard
                    register={register}
                    control={control}
                    errors={errors}
                />
            </div>

            <PersonFormRolesCard
                control={control}
                errors={errors}
            />
        </div>
    );
}
