import { useParams, useNavigate } from 'react-router';
import { usePersonnel } from '../context/PersonnelContext';
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
  const { getPersonById, loading, error, reload } = usePersonnel();
  const { units, loading: dictLoading } = useDictionaries();
  const { getUnitName, getPositionName, getRoleName, getStatusBadge } = usePersonnelFormatters();
  const { t } = useLanguage();

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
          <Button onClick={reload} variant="outline" className="mr-2">
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

  const person = getPersonById(id!);

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
          <Button variant="ghost" size="sm" onClick={() => navigate('/personnel')} className="shrink-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('card_back')}</span>
          </Button>
          <Separator orientation="vertical" className="h-8 hidden sm:block" />
          <div className="min-w-0">
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">{person.callsign}</h2>
              {getStatusBadge(person.status)}
            </div>
            <p className="text-muted-foreground mt-1 truncate">{person.fullName}</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/personnel/${id}/edit`)} className="shrink-0">
          <Edit className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">{t('card_edit')}</span>
        </Button>
      </div>

      <PersonCardQuickInfo
        person={person}
        getUnitName={getUnitName}
        getPositionName={getPositionName}
      />

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="general">{t('card_tab_general')}</TabsTrigger>
          <TabsTrigger value="education">{t('card_tab_education')}</TabsTrigger>
          <TabsTrigger value="family">{t('card_tab_family')}</TabsTrigger>
          <TabsTrigger value="documents">{t('card_tab_documents')}</TabsTrigger>
          <TabsTrigger value="awards">{t('card_tab_awards')}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <PersonCardGeneralTab
            person={person}
            formatDate={formatDate}
            getUnitName={getUnitName}
            getUnitPath={getUnitPath}
            getPositionName={getPositionName}
            getRoleName={getRoleName}
          />
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <PersonCardEducationTab person={person} />
        </TabsContent>

        <TabsContent value="family" className="space-y-6">
          <PersonCardFamilyTab person={person} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <PersonCardDocumentsTab person={person} />
        </TabsContent>

        <TabsContent value="awards" className="space-y-6">
          <PersonCardAwardsTab person={person} formatDate={formatDate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}