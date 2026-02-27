import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { usePersonnel } from '../context/PersonnelContext';
import { useDictionaries } from '../context/DictionariesContext';
import { Person } from '../types/personnel';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { Checkbox } from '../components/ui/checkbox';
import { useLanguage } from '../context/LanguageContext';
import { MaskedInput } from '../components/ui/masked-input';

const phonePattern = /^(?:\+?38)?0\d{9}$/;
const docPattern = /^[А-ЯҐЄІЇA-Z]{2}\s\d{6}$/i;
const stripPhone = (phone: string) => phone ? phone.replace(/^\+38|^38/, '') : '';
const prepPhone = (phone: string) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('380')) return '+' + digits;
  if (digits.length === 10 && digits.startsWith('0')) return '+38' + digits;
  return phone.startsWith('+') ? phone : '+38' + phone;
};

export function PersonForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPersonById, addPerson, updatePerson } = usePersonnel();
  const { units, positions, roles, ranks } = useDictionaries();
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
      <div className="flex items-center justify-between">
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

          {/* General Tab - P0 */}
          <TabsContent value="general" className="space-y-6">
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
          </TabsContent>

          {/* Additional Tab - P1 */}
          <TabsContent value="additional" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('form_additional_info')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="bloodType">{t('form_blood_type')}</Label>
                    <Input
                      id="bloodType"
                      {...register('bloodType')}
                      placeholder="A (II) Rh+"
                    />
                  </div>

                  <div>
                    <Label htmlFor="recruitedBy">{t('form_recruited_by')}</Label>
                    <Input
                      id="recruitedBy"
                      {...register('recruitedBy')}
                      placeholder="Шевченківський ТЦК"
                    />
                  </div>

                  <div>
                    <Label htmlFor="recruitedDate">{t('form_recruited_date')}</Label>
                    <Input
                      id="recruitedDate"
                      type="date"
                      {...register('recruitedDate')}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('form_emergency_contact')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="emergencyContactName">{t('form_ec_name')}</Label>
                    <Input
                      id="emergencyContactName"
                      {...register('family.emergencyContact.name')}
                      placeholder="Іваненко Марія Петрівна"
                    />
                  </div>

                  <div>
                    <Controller
                      name="family.emergencyContact.phone"
                      control={control}
                      rules={{
                        validate: (v) =>
                          !v || phonePattern.test(v) || t('form_val_phone_format'),
                      }}
                      render={({ field }) => (
                        <MaskedInput
                          id="emergencyContactPhone"
                          label={t('form_ec_phone')}
                          mask="+38 (000) 000-00-00"
                          value={field.value}
                          onAccept={(value) => {
                            field.onChange(value);
                          }}
                          error={errors.family?.emergencyContact?.phone?.message}
                          placeholder="+38 (0__) ___-__-__"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergencyContactRelation">{t('form_ec_relation')}</Label>
                    <Input
                      id="emergencyContactRelation"
                      {...register('family.emergencyContact.relation')}
                      placeholder="Дружина"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t('form_education')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('form_education_coming_soon')}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Extended Tab */}
          <TabsContent value="extended" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('form_extended_title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('form_extended_coming_soon')}
                </p>
              </CardContent>
            </Card>
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
