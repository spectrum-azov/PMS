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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PersonFormPersonalInfoCard
                register={register}
                control={control}
                errors={errors}
                validateBirthDate={validateBirthDate}
            />

            <PersonFormServiceInfoCard
                register={register}
                control={control}
                errors={errors}
            />

            <PersonFormRolesCard
                control={control}
                errors={errors}
            />

            <PersonFormContactCard
                register={register}
                control={control}
                errors={errors}
            />
        </div>
    );
}
