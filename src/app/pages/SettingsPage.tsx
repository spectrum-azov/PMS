import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { usePersonnel } from '../context/PersonnelContext';
import { useDictionaries } from '../context/DictionariesContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Save, RefreshCw, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { personnel } = usePersonnel();
  const { units, positions, roles } = useDictionaries();
  const { t } = useLanguage();

  const [orgName, setOrgName] = useState(settings.organizationName);
  const [orgSubtitle, setOrgSubtitle] = useState(settings.organizationSubtitle);

  const handleSaveOrganization = () => {
    updateSettings({ organizationName: orgName, organizationSubtitle: orgSubtitle });
    toast.success(t('settings_saved'));
  };


  const handleResetData = () => {
    if (window.confirm(t('settings_reset_confirm'))) {
      localStorage.removeItem('personnel-data');
      localStorage.removeItem('units-data');
      localStorage.removeItem('positions-data');
      localStorage.removeItem('roles-data');
      localStorage.removeItem('directions-data');
      toast.success(t('settings_reset_success'));
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">{t('settings_title')}</h2>
        <p className="text-gray-600 mt-1">{t('settings_subtitle')}</p>
      </div>

      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings_org_title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="orgName">{t('settings_org_name')}</Label>
            <Input
              id="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder=""
            />
          </div>
          <div>
            <Label htmlFor="orgSubtitle">{t('settings_org_subtitle')}</Label>
            <Input
              id="orgSubtitle"
              value={orgSubtitle}
              onChange={(e) => setOrgSubtitle(e.target.value)}
              placeholder=""
            />
          </div>
          <Button onClick={handleSaveOrganization}>
            <Save className="w-4 h-4 mr-2" />
            {t('settings_save')}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings_data_mgmt')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            {t('settings_current')} {personnel.length} {t('settings_persons')} · {units.length} {t('settings_units')} · {positions.length} {t('settings_positions')} · {roles.length} {t('settings_roles')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="destructive" onClick={handleResetData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('settings_reset')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            {t('settings_about')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-y-3 text-sm max-w-sm">
            <span className="text-gray-500">{t('settings_version')}</span>
            <span className="font-medium">1.0.0</span>
            <span className="text-gray-500">{t('settings_stack')}</span>
            <span className="font-medium">React 18 + TypeScript + Vite</span>
            <span className="text-gray-500">{t('settings_storage')}</span>
            <span className="font-medium">localStorage</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
