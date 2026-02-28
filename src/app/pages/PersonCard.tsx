import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as api from '../api/personnelApi';
import { Person } from '../types/personnel';

import { useDictionaries } from '../context/DictionariesContext';
import { usePersonnelFormatters } from '../hooks/usePersonnelFormatters';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Edit, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

import { PersonCardQuickInfo } from '../components/person-card/PersonCardQuickInfo';
import { PersonCardGeneralTab } from '../components/person-card/PersonCardGeneralTab';
import { PersonCardEducationTab } from '../components/person-card/PersonCardEducationTab';
import { PersonCardFamilyTab } from '../components/person-card/PersonCardFamilyTab';
import { PersonCardDocumentsTab } from '../components/person-card/PersonCardDocumentsTab';
import { PersonCardAwardsTab } from '../components/person-card/PersonCardAwardsTab';

export default function PersonCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { units, loading: dictLoading } = useDictionaries();
  const { getUnitName, getPositionName, getRoleName, getStatusBadge } = usePersonnelFormatters();
  const { t } = useLanguage();

  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPerson = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const res = await api.getPersonById(id);
    if (res.success) {
      setPerson(res.data);
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPerson();
  }, [id]);

  if (loading || dictLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground animate-pulse">{t('common_loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadPerson} variant="outline" className="mr-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('card_retry')}
          </Button>
          <Button onClick={() => navigate('/personnel')} className="mt-4">
            {t('card_return_to_registry')}
          </Button>
        </div>
      </div>
    );
  }

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
          <p className="text-muted-foreground">{t('card_person_not_found')}</p>
          <Button onClick={() => navigate('/personnel')} className="mt-4">
            {t('card_return_to_registry')}
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

  return (
    <div className="flex flex-col p-6 gap-6">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <Button variant="ghost" size="icon" onClick={() => navigate('/personnel')} className="shrink-0 sm:w-auto sm:px-3 sm:gap-2">
            <ArrowLeft className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{t('card_back')}</span>
          </Button>
          <Separator orientation="vertical" className="h-8 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-foreground uppercase truncate leading-none">
                {person.callsign}
              </h2>
              <div className="shrink-0">
                {getStatusBadge(person.status)}
              </div>
            </div>
            <p className="text-muted-foreground mt-1 truncate text-xs sm:text-sm hidden sm:block">{`${person.lastName} ${person.firstName} ${person.middleName}`}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(`/personnel/${id}/edit`)}
          className="shrink-0 sm:hidden"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => navigate(`/personnel/${id}/edit`)}
          className="shrink-0 hidden sm:flex"
        >
          <Edit className="w-4 h-4 mr-2" />
          <span>{t('card_edit')}</span>
        </Button>
      </div>

      <div className="shrink-0">
        <PersonCardQuickInfo
          person={person}
          getUnitName={getUnitName}
          getPositionName={getPositionName}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="flex flex-col w-full">
        <TabsList className="shrink-0 flex w-full overflow-x-auto overflow-y-hidden justify-start md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <TabsTrigger value="general">{t('card_tab_general')}</TabsTrigger>
          <TabsTrigger value="education">{t('card_tab_education')}</TabsTrigger>
          <TabsTrigger value="family">{t('card_tab_family')}</TabsTrigger>
          <TabsTrigger value="documents">{t('card_tab_documents')}</TabsTrigger>
          <TabsTrigger value="awards">{t('card_tab_awards')}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 focus-visible:outline-none">
          <PersonCardGeneralTab
            person={person}
            formatDate={formatDate}
            getUnitName={getUnitName}
            getUnitPath={getUnitPath}
            getPositionName={getPositionName}
            getRoleName={getRoleName}
          />
        </TabsContent>

        <TabsContent value="education" className="space-y-6 focus-visible:outline-none">
          <PersonCardEducationTab person={person} />
        </TabsContent>

        <TabsContent value="family" className="space-y-6 focus-visible:outline-none">
          <PersonCardFamilyTab person={person} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6 focus-visible:outline-none">
          <PersonCardDocumentsTab person={person} />
        </TabsContent>

        <TabsContent value="awards" className="space-y-6 focus-visible:outline-none">
          <PersonCardAwardsTab person={person} formatDate={formatDate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}