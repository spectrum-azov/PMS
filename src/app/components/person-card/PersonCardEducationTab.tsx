import { Person } from '../../types/personnel';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { GraduationCap, Car } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PersonCardEducationTabProps {
    person: Person;
}

export function PersonCardEducationTab({ person }: PersonCardEducationTabProps) {
    const { t } = useLanguage();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Education */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5" />
                        {t('card_education')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {person.education && person.education.length > 0 ? (
                        <div className="space-y-4">
                            {person.education.map((edu: {
                                id: string; institution: string; specialty: string; degree: string; startYear: number; endYear: number
                            }) => (
                                <div key={edu.id} className="p-4 bg-muted rounded-lg">
                                    <p className="font-medium text-foreground">{edu.institution}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{edu.specialty}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                        <span>{edu.startYear} - {edu.endYear}</span>
                                        <Badge variant="outline" className="text-xs">{edu.degree}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">{t('card_no_education')}</p>
                    )}
                </CardContent>
            </Card>

            {/* Driving License */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Car className="w-5 h-5" />
                        {t('card_driving_license')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {person.drivingLicense ? (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('card_dl_categories')}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {person.drivingLicense.categories.map((cat: string) => (
                                        <Badge key={cat} variant="secondary">{cat}</Badge>
                                    ))}
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground">{t('card_dl_year')}</p>
                                <p className="font-medium">{person.drivingLicense.yearObtained}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground">{t('card_dl_experience')}</p>
                                <p className="font-medium">{person.drivingLicense.experience} {t('card_dl_years')}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">{t('card_no_driving_license')}</p>
                    )}
                </CardContent>
            </Card>

            {/* Skills */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>{t('card_skills')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {person.skills && person.skills.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {person.skills.map((skill: {
                                id: string; name: string; category: string; level: number
                            }) => (
                                <div key={skill.id} className="p-4 bg-muted rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-medium text-foreground">{skill.name}</p>
                                        <Badge variant={skill.level === 3 ? 'default' : 'secondary'}>
                                            {t('card_skill_level')} {skill.level}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{skill.category}</p>
                                    <div className="mt-3">
                                        <div className="w-full bg-muted-foreground/20 rounded-full h-2">
                                            <div
                                                className="bg-primary h-2 rounded-full transition-all"
                                                style={{ width: `${(skill.level / 3) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">{t('card_no_skills')}</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
