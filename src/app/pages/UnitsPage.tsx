import { useState } from 'react';
import { useDictionaries } from '../context/DictionariesContext';
import { OrganizationalUnit } from '../types/personnel';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';

export function UnitsPage() {
  const { units, addUnit, updateUnit, deleteUnit } = useDictionaries();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<OrganizationalUnit | null>(null);
  const [formData, setFormData] = useState<Partial<OrganizationalUnit>>({
    name: '',
    abbreviation: '',
    type: 'Група',
    location: '',
    parentId: '',
  });

  const handleOpenDialog = (unit?: OrganizationalUnit) => {
    if (unit) {
      setEditingUnit(unit);
      setFormData(unit);
    } else {
      setEditingUnit(null);
      setFormData({
        name: '',
        abbreviation: '',
        type: 'Група',
        location: '',
        parentId: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Назва обов\'язкова');
      return;
    }

    if (editingUnit) {
      updateUnit(editingUnit.id, formData);
      toast.success('Підрозділ оновлено');
    } else {
      const newUnit: OrganizationalUnit = {
        id: `unit-${Date.now()}`,
        name: formData.name!,
        abbreviation: formData.abbreviation,
        type: formData.type,
        location: formData.location,
        parentId: formData.parentId || undefined,
      };
      addUnit(newUnit);
      toast.success('Підрозділ додано');
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цей підрозділ?')) {
      deleteUnit(id);
      toast.success('Підрозділ видалено');
    }
  };

  const getParentName = (parentId?: string) => {
    if (!parentId) return '—';
    const parent = units.find(u => u.id === parentId);
    return parent?.abbreviation || parent?.name || '—';
  };

  const getTypeBadge = (type?: string) => {
    const colors: Record<string, string> = {
      'Частина': 'bg-blue-100 text-blue-800',
      'Відділ': 'bg-green-100 text-green-800',
      'Група': 'bg-purple-100 text-purple-800',
    };
    return (
      <Badge variant="secondary" className={colors[type || ''] || ''}>
        {type || 'Не вказано'}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Організаційні підрозділи</h2>
          <p className="text-gray-600 mt-1">
            Управління структурою підрозділів. Всього: <span className="font-medium">{units.length}</span>
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Додати підрозділ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUnit ? 'Редагувати підрозділ' : 'Новий підрозділ'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Назва *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Група мереж та ІТ"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="abbreviation">Скорочення</Label>
                  <Input
                    id="abbreviation"
                    value={formData.abbreviation}
                    onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                    placeholder="IT"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Тип рівня</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Частина">Частина</SelectItem>
                      <SelectItem value="Відділ">Відділ</SelectItem>
                      <SelectItem value="Група">Група</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Місце дислокації</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Київ"
                  />
                </div>

                <div>
                  <Label htmlFor="parentId">Батьківський підрозділ</Label>
                  <Select
                    value={formData.parentId || 'none'}
                    onValueChange={(value) => setFormData({ ...formData, parentId: value === 'none' ? undefined : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Без батьківського підрозділу" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Без батьківського підрозділу</SelectItem>
                      {units.filter(u => u.id !== editingUnit?.id).map(u => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.abbreviation} - {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Скасувати
                </Button>
                <Button type="submit">
                  {editingUnit ? 'Оновити' : 'Створити'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Список підрозділів
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Скорочення</TableHead>
                  <TableHead>Назва</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Батьківський підрозділ</TableHead>
                  <TableHead>Локація</TableHead>
                  <TableHead className="text-right">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Підрозділів немає. Додайте перший підрозділ.
                    </TableCell>
                  </TableRow>
                ) : (
                  units.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell>
                        <span className="font-medium text-blue-600 font-mono">
                          {unit.abbreviation || '—'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{unit.name}</span>
                      </TableCell>
                      <TableCell>{getTypeBadge(unit.type)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {getParentName(unit.parentId)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{unit.location || '—'}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(unit)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(unit.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
