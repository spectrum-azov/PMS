import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { usePersonnel } from '../context/PersonnelContext';
import { Person } from '../types/personnel';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { PersonFormGeneralTab } from '../components/person-form/PersonFormGeneralTab';
import { PersonFormAdditionalTab } from '../components/person-form/PersonFormAdditionalTab';
import { PersonFormExtendedTab } from '../components/person-form/PersonFormExtendedTab';

const stripPhone = (phone: string) => phone ? phone.replace(/^\+38|^38/, '') : '';
const prepPhone = (phone: string) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('380')) return '+' + digits;
  if (digits.length === 10 && digits.startsWith('0')) return '+38' + digits;
  return phone.startsWith('+') ? phone : '+38' + phone;
};

export default function PersonForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPersonById, addPerson, updatePerson } = usePersonnel();
  const { t } = useLanguage();

  const validateBirthDate = (value: string): true | string => {
    if (!value) return t('common_required_field');
    const date = new Date(value);
    const now = new Date();
    if (date >= now) return t('form_val_birthdate_future');
    const age = now.getFullYear() - date.getFullYear() -
      (now < new Date(now.getFullYear(), date.getMonth(), date.getDate()) ? 1 : 0);
    if (age < 18) return t('form_val_birthdate_min18');
    if (age > 70) return t('form_val_birthdate_max70');
    return true;
  };

  const isEditMode = id !== undefined;
  const existingPerson = isEditMode ? getPersonById(id!) : null;

  const defaultValues: Person = existingPerson
    ? {
      ...existingPerson,
      phone: stripPhone(existingPerson.phone),
      family: {
        ...existingPerson.family,
        emergencyContact: {
          name: existingPerson.family?.emergencyContact?.name || '',
          phone: stripPhone(existingPerson.family?.emergencyContact?.phone || ''),
          relation: existingPerson.family?.emergencyContact?.relation || '',
        },
      },
    }
    : {
      id: '',
      callsign: '',
      fullName: '',
      rank: 'Солдат',
      birthDate: '',
      serviceType: 'Контракт',
      tagNumber: '',
      unitId: '',
      positionId: '',
      roleIds: [],
      status: 'Служить',
      phone: '',
      citizenship: 'Україна',
      address: '',
      registrationAddress: '',
      militaryId: '',
      passport: '',
      taxId: '',
      bloodType: '',
      recruitedBy: '',
      recruitedDate: '',
      family: {
        emergencyContact: {
          name: '',
          phone: '',
          relation: '',
        },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<Person>({
    defaultValues,
  });

  useEffect(() => {
    if (existingPerson) {
      reset({
        ...existingPerson,
        phone: stripPhone(existingPerson.phone),
        family: {
          ...existingPerson.family,
          emergencyContact: {
            name: existingPerson.family?.emergencyContact?.name || '',
            phone: stripPhone(existingPerson.family?.emergencyContact?.phone || ''),
            relation: existingPerson.family?.emergencyContact?.relation || '',
          },
        },
      });
    }
  }, [existingPerson?.id, reset]);

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: Person) => {
    setSubmitting(true);
    const processedData = {
      ...data,
      phone: prepPhone(data.phone),
      family: {
        ...data.family,
        emergencyContact: data.family?.emergencyContact ? {
          ...data.family.emergencyContact,
          phone: prepPhone(data.family.emergencyContact.phone),
        } : undefined
      }
    };

    try {
      if (isEditMode) {
        const success = await updatePerson(id!, processedData);
        if (success) {
          toast.success(t('form_saved_success'));
          navigate('/personnel');
        }
      } else {
        const success = await addPerson(processedData);
        if (success) {
          toast.success(t('form_created_success'));
          navigate('/personnel');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/personnel')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common_back')}
          </Button>
          <Separator orientation="vertical" className="h-8" />
          <div>
            <h2 className="text-3xl font-semibold text-foreground">
              {isEditMode ? t('form_edit_title') : t('form_add_title')}
            </h2>
            <p className="text-muted-foreground mt-1">
              {isEditMode ? t('form_edit_subtitle') : t('form_add_subtitle')}
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit(onSubmit)} disabled={submitting}>
          {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {t('form_save')}
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">{t('form_tab_general')}</TabsTrigger>
            <TabsTrigger value="additional">{t('form_tab_additional')}</TabsTrigger>
            <TabsTrigger value="extended">{t('form_tab_extended')}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <PersonFormGeneralTab
              register={register}
              control={control}
              errors={errors}
              validateBirthDate={validateBirthDate}
            />
          </TabsContent>

          <TabsContent value="additional" className="space-y-6">
            <PersonFormAdditionalTab
              register={register}
              control={control}
              errors={errors}
            />
          </TabsContent>

          <TabsContent value="extended" className="space-y-6">
            <PersonFormExtendedTab />
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/personnel')}
          >
            {t('common_cancel')}
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isEditMode ? t('common_update') : t('common_create')}
          </Button>
        </div>
      </form>
    </div>
  );
}
