import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { usePersonnel } from '../context/PersonnelContext';
import { useDictionaries } from '../context/DictionariesContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Save, Download, RefreshCw, Info } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { personnel } = usePersonnel();
  const { units, positions, roles } = useDictionaries();

  const [orgName, setOrgName] = useState(settings.organizationName);
  const [orgSubtitle, setOrgSubtitle] = useState(settings.organizationSubtitle);

  const handleSaveOrganization = () => {
    updateSettings({ organizationName: orgName, organizationSubtitle: orgSubtitle });
    toast.success('Налаштування збережено');
  };

  const handleExportData = () => {
    const data = {
      personnel,
      units,
      positions,
      roles,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pms-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Дані експортовано');
  };

  const handleResetData = () => {
    if (window.confirm('Скинути всі дані до початкових? Ця дія незворотня.')) {
      localStorage.removeItem('personnel-data');
      localStorage.removeItem('units-data');
      localStorage.removeItem('positions-data');
      localStorage.removeItem('roles-data');
      localStorage.removeItem('directions-data');
      toast.success('Дані скинуто. Перезавантаження...');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Налаштування</h2>
        <p className="text-gray-600 mt-1">Конфігурація системи</p>
      </div>

      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Налаштування організації</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="orgName">Назва системи</Label>
            <Input
              id="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Управління особовим складом"
            />
          </div>
          <div>
            <Label htmlFor="orgSubtitle">Підзаголовок</Label>
            <Input
              id="orgSubtitle"
              value={orgSubtitle}
              onChange={(e) => setOrgSubtitle(e.target.value)}
              placeholder="Вузол зв'язку 1-го корпусу"
            />
          </div>
          <Button onClick={handleSaveOrganization}>
            <Save className="w-4 h-4 mr-2" />
            Зберегти
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Управління даними</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            Поточно: {personnel.length} осіб · {units.length} підрозділів · {positions.length} посад · {roles.length} ролей
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Експортувати всі дані
            </Button>
            <Button variant="destructive" onClick={handleResetData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Скинути до тестових даних
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
            Про систему
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-y-3 text-sm max-w-sm">
            <span className="text-gray-500">Версія</span>
            <span className="font-medium">1.0.0</span>
            <span className="text-gray-500">Стек</span>
            <span className="font-medium">React 18 + TypeScript + Vite</span>
            <span className="text-gray-500">Сховище</span>
            <span className="font-medium">localStorage</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
