import { useState } from 'react';
import { useDictionaries } from '../context/DictionariesContext';
import { Position } from '../types/personnel';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
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
import { Plus, Edit, Trash2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';

export function PositionsPage() {
  const { positions, addPosition, updatePosition, deletePosition } = useDictionaries();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [formData, setFormData] = useState<Partial<Position>>({
    name: '',
    category: 'Солдат',
    description: '',
  });

  const handleOpenDialog = (position?: Position) => {
    if (position) {
      setEditingPosition(position);
      setFormData(position);
    } else {
      setEditingPosition(null);
      setFormData({
        name: '',
        category: 'Солдат',
        description: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      toast.error('Назва та категорія обов\'язкові');
      return;
    }

    if (editingPosition) {
      updatePosition(editingPosition.id, formData);
      toast.success('Посаду оновлено');
    } else {
      const newPosition: Position = {
        id: `pos-${Date.now()}`,
        name: formData.name!,
        category: formData.category as any,
        description: formData.description,
      };
      addPosition(newPosition);
      toast.success('Посаду додано');
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цю посаду?')) {
      deletePosition(id);
      toast.success('Посаду видалено');
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'Командир': 'bg-red-100 text-red-800',
      'Сержант': 'bg-orange-100 text-orange-800',
      'Солдат': 'bg-blue-100 text-blue-800',
      'Цивільний': 'bg-gray-100 text-gray-800',
    };
    return (
      <Badge variant="secondary" className={colors[category] || ''}>
        {category}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Штатні посади</h2>
          <p className="text-gray-600 mt-1">
            Управління штатними посадами. Всього: <span className="font-medium">{positions.length}</span>
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Додати посаду
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPosition ? 'Редагувати посаду' : 'Нова посада'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Назва посади *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Оператор радіозв'язку"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Категорія *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Командир">Командир</SelectItem>
                      <SelectItem value="Сержант">Сержант</SelectItem>
                      <SelectItem value="Солдат">Солдат</SelectItem>
                      <SelectItem value="Цивільний">Цивільний</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Опис функціоналу</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Обслуговування радіомережі"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Скасувати
                </Button>
                <Button type="submit">
                  {editingPosition ? 'Оновити' : 'Створити'}
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
            <Briefcase className="w-5 h-5" />
            Список посад
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Назва посади</TableHead>
                  <TableHead>Категорія</TableHead>
                  <TableHead>Опис</TableHead>
                  <TableHead className="text-right">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      Посад немає. Додайте першу посаду.
                    </TableCell>
                  </TableRow>
                ) : (
                  positions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell>
                        <span className="font-medium">{position.name}</span>
                      </TableCell>
                      <TableCell>{getCategoryBadge(position.category)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {position.description || '—'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(position)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(position.id)}
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
