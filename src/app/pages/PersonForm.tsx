import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { usePersonnel } from '../context/PersonnelContext';
import { useDictionaries } from '../context/DictionariesContext';
import { Person, Rank } from '../types/personnel';
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
import { ArrowLeft, Save } from 'lucide-react';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { Checkbox } from '../components/ui/checkbox';

const ranks: Rank[] = [
  'Солдат',
  'Старший солдат',
  'Молодший сержант',
  'Сержант',
  'Старший сержант',
  'Головний сержант',
  'Штаб-сержант',
  'Майстер-сержант',
  'Головний майстер-сержант',
  'Молодший лейтенант',
  'Лейтенант',
  'Старший лейтенант',
  'Капітан',
  'Майор',
  'Підполковник',
  'Полковник'
];

const phonePattern = /^(\+380\d{9}|0\d{9})$/;

function validateBirthDate(value: string): true | string {
  if (!value) return "Обов'язкове поле";
  const date = new Date(value);
  const now = new Date();
  if (date >= now) return 'Дата не може бути у майбутньому';
  const age = now.getFullYear() - date.getFullYear() -
    (now < new Date(now.getFullYear(), date.getMonth(), date.getDate()) ? 1 : 0);
  if (age < 18) return 'Вік має бути не менше 18 років';
  if (age > 70) return 'Вік має бути не більше 70 років';
  return true;
}

export function PersonForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPersonById, addPerson, updatePerson } = usePersonnel();
  const { units, positions, roles } = useDictionaries();

  const isEditMode = id !== undefined;
  const existingPerson = isEditMode ? getPersonById(id!) : null;

  const defaultValues: Person = existingPerson
    ? {
        ...existingPerson,
        family: {
          ...existingPerson.family,
          emergencyContact: {
            name: existingPerson.family?.emergencyContact?.name || '',
            phone: existingPerson.family?.emergencyContact?.phone || '',
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
        family: {
          ...existingPerson.family,
          emergencyContact: {
            name: existingPerson.family?.emergencyContact?.name || '',
            phone: existingPerson.family?.emergencyContact?.phone || '',
            relation: existingPerson.family?.emergencyContact?.relation || '',
          },
        },
      });
    }
  }, [existingPerson?.id]);

  const onSubmit = (data: Person) => {
    if (isEditMode) {
      updatePerson(id!, { ...data, updatedAt: new Date().toISOString() });
      toast.success('Дані успішно оновлено');
    } else {
      const newPerson: Person = {
        ...data,
        id: `person-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addPerson(newPerson);
      toast.success('Особу успішно додано');
    }
    navigate('/personnel');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/personnel')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <Separator orientation="vertical" className="h-8" />
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">
              {isEditMode ? 'Редагування особи' : 'Додати нову особу'}
            </h2>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Внесіть зміни у дані' : "Заповніть обов'язкові поля"}
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit(onSubmit)}>
          <Save className="w-4 h-4 mr-2" />
          Зберегти
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Основні дані (P0)</TabsTrigger>
            <TabsTrigger value="additional">Додаткові дані (P1)</TabsTrigger>
            <TabsTrigger value="extended">Розширені дані</TabsTrigger>
          </TabsList>

          {/* General Tab - P0 */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Особисті дані</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="callsign">Позивний *</Label>
                    <Input
                      id="callsign"
                      {...register('callsign', {
                        required: "Обов'язкове поле",
                        minLength: { value: 2, message: 'Мінімум 2 символи' },
                      })}
                      placeholder="Сатурн"
                    />
                    {errors.callsign && (
                      <p className="text-sm text-red-600 mt-1">{errors.callsign.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="fullName">Повне ім'я *</Label>
                    <Input
                      id="fullName"
                      {...register('fullName', {
                        required: "Обов'язкове поле",
                        validate: (v) =>
                          v.trim().split(/\s+/).length >= 2 || 'Введіть як мінімум прізвище та ім\'я',
                      })}
                      placeholder="Іваненко Іван Іванович"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="rank">Військове звання *</Label>
                    <Controller
                      name="rank"
                      control={control}
                      rules={{ required: "Обов'язкове поле" }}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Оберіть звання" />
                          </SelectTrigger>
                          <SelectContent>
                            {ranks.map((rank) => (
                              <SelectItem key={rank} value={rank}>
                                {rank}
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
                    <Label htmlFor="birthDate">Дата народження *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      {...register('birthDate', {
                        required: "Обов'язкове поле",
                        validate: validateBirthDate,
                      })}
                    />
                    {errors.birthDate && (
                      <p className="text-sm text-red-600 mt-1">{errors.birthDate.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="citizenship">Громадянство</Label>
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
                  <CardTitle>Служба</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="serviceType">Вид служби *</Label>
                    <Controller
                      name="serviceType"
                      control={control}
                      rules={{ required: "Обов'язкове поле" }}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Контракт">Контракт</SelectItem>
                            <SelectItem value="Мобілізований">Мобілізований</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.serviceType && (
                      <p className="text-sm text-red-600 mt-1">{errors.serviceType.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="tagNumber">Номер жетона</Label>
                    <Input
                      id="tagNumber"
                      {...register('tagNumber')}
                      placeholder="1245"
                    />
                  </div>

                  <div>
                    <Label htmlFor="unitId">Підрозділ *</Label>
                    <Controller
                      name="unitId"
                      control={control}
                      rules={{ required: 'Оберіть підрозділ' }}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Оберіть підрозділ" />
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
                    <Label htmlFor="positionId">Штатна посада *</Label>
                    <Controller
                      name="positionId"
                      control={control}
                      rules={{ required: 'Оберіть посаду' }}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Оберіть посаду" />
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
                    <Label htmlFor="status">Статус</Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Служить">Служить</SelectItem>
                            <SelectItem value="Переведений">Переведений</SelectItem>
                            <SelectItem value="Звільнений">Звільнений</SelectItem>
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
                  <CardTitle>Фактичні ролі *</CardTitle>
                </CardHeader>
                <CardContent>
                  <Controller
                    name="roleIds"
                    control={control}
                    rules={{ validate: (v) => (v && v.length > 0) || 'Оберіть хоча б одну роль' }}
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
                  <CardTitle>Контактна інформація</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      {...register('phone', {
                        required: "Обов'язкове поле",
                        pattern: {
                          value: phonePattern,
                          message: 'Формат: +380XXXXXXXXX або 0XXXXXXXXX',
                        },
                      })}
                      placeholder="+380981234567"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Місце проживання</Label>
                    <Input
                      id="address"
                      {...register('address')}
                      placeholder="Київ, вул Абв 1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="registrationAddress">Місце реєстрації</Label>
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
                  <CardTitle>Документи</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="militaryId">Військове посвідчення</Label>
                    <Input
                      id="militaryId"
                      {...register('militaryId')}
                      placeholder="АА №123456"
                    />
                  </div>

                  <div>
                    <Label htmlFor="passport">Паспорт</Label>
                    <Input
                      id="passport"
                      {...register('passport', {
                        validate: (v) =>
                          !v || /^[А-ЯҐЄІЇA-Z]{2}\s?№?\d{6}$/i.test(v) || 'Формат: КВ №987654',
                      })}
                      placeholder="КВ №987654"
                    />
                    {errors.passport && (
                      <p className="text-sm text-red-600 mt-1">{errors.passport.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="taxId">ІПН</Label>
                    <Input
                      id="taxId"
                      {...register('taxId', {
                        validate: (v) => !v || /^\d{10}$/.test(v) || 'ІПН має містити 10 цифр',
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
                  <CardTitle>Додаткова інформація</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="bloodType">Група крові</Label>
                    <Input
                      id="bloodType"
                      {...register('bloodType')}
                      placeholder="A (II) Rh+"
                    />
                  </div>

                  <div>
                    <Label htmlFor="recruitedBy">Ким призваний</Label>
                    <Input
                      id="recruitedBy"
                      {...register('recruitedBy')}
                      placeholder="Шевченківський ТЦК"
                    />
                  </div>

                  <div>
                    <Label htmlFor="recruitedDate">Дата призову</Label>
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
                  <CardTitle>Контактна особа</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="emergencyContactName">Ім'я</Label>
                    <Input
                      id="emergencyContactName"
                      {...register('family.emergencyContact.name')}
                      placeholder="Іваненко Марія Петрівна"
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergencyContactPhone">Телефон</Label>
                    <Input
                      id="emergencyContactPhone"
                      {...register('family.emergencyContact.phone', {
                        validate: (v) =>
                          !v || phonePattern.test(v) || 'Формат: +380XXXXXXXXX або 0XXXXXXXXX',
                      })}
                      placeholder="+380981112233"
                    />
                    {errors.family?.emergencyContact?.phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.family.emergencyContact.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="emergencyContactRelation">Відношення</Label>
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
                <CardTitle>Освіта</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Функціонал додавання освіти буде доступний у наступних версіях
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Extended Tab */}
          <TabsContent value="extended" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Навички, допуски, медичні дані</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Функціонал буде доступний у наступних версіях (P1, P2, P3)
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
            Скасувати
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            {isEditMode ? 'Оновити' : 'Створити'}
          </Button>
        </div>
      </form>
    </div>
  );
}
