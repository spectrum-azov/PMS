import { useParams, useNavigate } from 'react-router';
import { usePersonnel } from '../context/PersonnelContext';
import { useDictionaries } from '../context/DictionariesContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  Award,
  GraduationCap,
  Car,
  Users,
  Shield,
  Briefcase,
  FileText,
  Heart
} from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

export function PersonCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPersonById } = usePersonnel();
  const { units, positions, roles } = useDictionaries();

  const person = getPersonById(id!);

  // Helper functions
  const getUnitName = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    return unit?.name || 'Невідомо';
  };

  const getPositionName = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    return position?.name || 'Невідомо';
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.name || 'Невідомо';
  };

  const getUnitPath = (unitId: string): string => {
    const path: string[] = [];
    let currentUnit = units.find(u => u.id === unitId);
    
    while (currentUnit) {
      path.unshift(currentUnit.abbreviation || currentUnit.name);
      currentUnit = units.find(u => u.id === currentUnit!.parentId);
    }
    
    return path.join(' → ');
  };

  if (!person) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Особу не знайдено</p>
          <Button onClick={() => navigate('/personnel')} className="mt-4">
            Повернутися до реєстру
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: uk });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'Служить': 'default',
      'Переведений': 'secondary',
      'Звільнений': 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
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
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-semibold text-gray-900">{person.callsign}</h2>
              {getStatusBadge(person.status)}
            </div>
            <p className="text-gray-600 mt-1">{person.fullName}</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/personnel/${id}/edit`)}>
          <Edit className="w-4 h-4 mr-2" />
          Редагувати
        </Button>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Звання</p>
                <p className="font-medium text-gray-900">{person.rank}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Вид служби</p>
                <p className="font-medium text-gray-900">{person.serviceType}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Підрозділ</p>
                <p className="font-medium text-gray-900 truncate">{getUnitName(person.unitId)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Посада</p>
                <p className="font-medium text-gray-900 truncate">{getPositionName(person.positionId)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Загальне</TabsTrigger>
          <TabsTrigger value="education">Освіта і навички</TabsTrigger>
          <TabsTrigger value="family">Родина</TabsTrigger>
          <TabsTrigger value="documents">Документи</TabsTrigger>
          <TabsTrigger value="awards">Нагороди</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle>Особисті дані</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Повне ім'я</p>
                  <p className="font-medium">{person.fullName}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500">Позивний</p>
                  <p className="font-medium font-mono text-blue-600">{person.callsign}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500">Дата народження</p>
                  <p className="font-medium">{formatDate(person.birthDate)}</p>
                </div>
                <Separator />
                {person.bloodType && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Група крові</p>
                      <p className="font-medium">{person.bloodType}</p>
                    </div>
                    <Separator />
                  </>
                )}
                <div>
                  <p className="text-sm text-gray-500">Громадянство</p>
                  <p className="font-medium">{person.citizenship || 'Не вказано'}</p>
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
                  <p className="text-sm text-gray-500">Військове звання</p>
                  <p className="font-medium">{person.rank}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500">Вид служби</p>
                  <Badge>{person.serviceType}</Badge>
                </div>
                <Separator />
                {person.tagNumber && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Номер жетона</p>
                      <p className="font-medium font-mono">{person.tagNumber}</p>
                    </div>
                    <Separator />
                  </>
                )}
                {person.recruitedBy && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Ким призваний</p>
                      <p className="font-medium">{person.recruitedBy}</p>
                    </div>
                    <Separator />
                  </>
                )}
                {person.recruitedDate && (
                  <div>
                    <p className="text-sm text-gray-500">Дата призову</p>
                    <p className="font-medium">{formatDate(person.recruitedDate)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Organization */}
            <Card>
              <CardHeader>
                <CardTitle>Організаційна структура</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Підрозділ</p>
                  <p className="font-medium">{getUnitName(person.unitId)}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {getUnitPath(person.unitId)}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500">Штатна посада</p>
                  <p className="font-medium">{getPositionName(person.positionId)}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500">Фактичні ролі</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {person.roleIds.map((roleId) => (
                      <Badge key={roleId} variant="outline">
                        {getRoleName(roleId)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Контактна інформація</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Основний телефон</p>
                    <p className="font-medium font-mono">{person.phone}</p>
                  </div>
                </div>
                {person.additionalPhones && person.additionalPhones.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Додаткові телефони</p>
                        {person.additionalPhones.map((phone, idx) => (
                          <p key={idx} className="font-medium font-mono">{phone}</p>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {person.address && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Місце проживання</p>
                        <p className="font-medium">{person.address}</p>
                      </div>
                    </div>
                  </>
                )}
                {person.registrationAddress && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Місце реєстрації</p>
                        <p className="font-medium">{person.registrationAddress}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Освіта
                </CardTitle>
              </CardHeader>
              <CardContent>
                {person.education && person.education.length > 0 ? (
                  <div className="space-y-4">
                    {person.education.map((edu) => (
                      <div key={edu.id} className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">{edu.institution}</p>
                        <p className="text-sm text-gray-600 mt-1">{edu.specialty}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{edu.startYear} - {edu.endYear}</span>
                          <Badge variant="outline" className="text-xs">{edu.degree}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Інформація про освіту відсутня</p>
                )}
              </CardContent>
            </Card>

            {/* Driving License */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Водійські права
                </CardTitle>
              </CardHeader>
              <CardContent>
                {person.drivingLicense ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Категорії</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {person.drivingLicense.categories.map((cat) => (
                          <Badge key={cat} variant="secondary">{cat}</Badge>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-500">Рік отримання</p>
                      <p className="font-medium">{person.drivingLicense.yearObtained}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-500">Стаж водіння</p>
                      <p className="font-medium">{person.drivingLicense.experience} років</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Водійських прав немає</p>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Навички та компетенції</CardTitle>
              </CardHeader>
              <CardContent>
                {person.skills && person.skills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {person.skills.map((skill) => (
                      <div key={skill.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900">{skill.name}</p>
                          <Badge variant={skill.level === 3 ? 'default' : 'secondary'}>
                            Рівень {skill.level}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">{skill.category}</p>
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${(skill.level / 3) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Навички не вказані</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Family Tab */}
        <TabsContent value="family" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Контактна особа у надзвичайній ситуації
              </CardTitle>
            </CardHeader>
            <CardContent>
              {person.family?.emergencyContact ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Ім'я</p>
                    <p className="font-medium">{person.family.emergencyContact.name}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Телефон</p>
                    <p className="font-medium font-mono">{person.family.emergencyContact.phone}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Відношення</p>
                    <p className="font-medium">{person.family.emergencyContact.relation}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Контактна особа не вказана</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Документи</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {person.militaryId && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Військове посвідчення</p>
                    <p className="font-medium font-mono">{person.militaryId}</p>
                  </div>
                  <Separator />
                </>
              )}
              {person.passport && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Паспорт</p>
                    <p className="font-medium font-mono">{person.passport}</p>
                  </div>
                  <Separator />
                </>
              )}
              {person.taxId && (
                <div>
                  <p className="text-sm text-gray-500">ІПН</p>
                  <p className="font-medium font-mono">{person.taxId}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Awards Tab */}
        <TabsContent value="awards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Нагороди та відзнаки
              </CardTitle>
            </CardHeader>
            <CardContent>
              {person.awards && person.awards.length > 0 ? (
                <div className="space-y-4">
                  {person.awards.map((award) => (
                    <div key={award.id} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{award.name}</p>
                          <p className="text-sm text-gray-600 mt-1">{award.reason}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <Badge>{award.level}</Badge>
                            <span className="text-xs text-gray-500">{formatDate(award.dateAwarded)}</span>
                          </div>
                        </div>
                        <Award className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Нагороди відсутні</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}