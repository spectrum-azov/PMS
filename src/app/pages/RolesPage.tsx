import { useState } from 'react';
import { useDictionaries } from '../context/DictionariesContext';
import { Role } from '../types/personnel';
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
import { Plus, Edit, Trash2, UserCog, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';

export function RolesPage() {
  const { roles, addRole, updateRole, deleteRole, directions, addDirection, updateDirection, deleteDirection } = useDictionaries();
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDirectionDialogOpen, setIsDirectionDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingDirection, setEditingDirection] = useState<{ id: string; name: string } | null>(null);
  const [roleFormData, setRoleFormData] = useState<Partial<Role>>({
    name: '',
    directionId: '',
    level: 1,
  });
  const [directionFormData, setDirectionFormData] = useState({ name: '' });

  const handleOpenRoleDialog = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setRoleFormData(role);
    } else {
      setEditingRole(null);
      setRoleFormData({
        name: '',
        directionId: '',
        level: 1,
      });
    }
    setIsRoleDialogOpen(true);
  };

  const handleOpenDirectionDialog = (direction?: { id: string; name: string }) => {
    if (direction) {
      setEditingDirection(direction);
      setDirectionFormData({ name: direction.name });
    } else {
      setEditingDirection(null);
      setDirectionFormData({ name: '' });
    }
    setIsDirectionDialogOpen(true);
  };

  const handleSubmitRole = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roleFormData.name || !roleFormData.directionId) {
      toast.error('Назва та напрямок обов\'язкові');
      return;
    }

    if (editingRole) {
      updateRole(editingRole.id, roleFormData);
      toast.success('Роль оновлено');
    } else {
      const newRole: Role = {
        id: `role-${Date.now()}`,
        name: roleFormData.name!,
        directionId: roleFormData.directionId!,
        level: roleFormData.level,
      };
      addRole(newRole);
      toast.success('Роль додано');
    }

    setIsRoleDialogOpen(false);
  };

  const handleSubmitDirection = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!directionFormData.name) {
      toast.error('Назва обов\'язкова');
      return;
    }

    if (editingDirection) {
      updateDirection(editingDirection.id, directionFormData);
      toast.success('Напрямок оновлено');
    } else {
      addDirection({
        id: `dir-${Date.now()}`,
        name: directionFormData.name,
      });
      toast.success('Напрямок додано');
    }

    setIsDirectionDialogOpen(false);
  };

  const handleDeleteRole = (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цю роль?')) {
      deleteRole(id);
      toast.success('Роль видалено');
    }
  };

  const handleDeleteDirection = (id: string) => {
    const hasRoles = roles.some(r => r.directionId === id);
    if (hasRoles) {
      toast.error('Неможливо видалити напрямок, до якого прив\'язані ролі');
      return;
    }
    if (confirm('Ви впевнені, що хочете видалити цей напрямок?')) {
      deleteDirection(id);
      toast.success('Напрямок видалено');
    }
  };

  const getDirectionName = (directionId: string) => {
    const direction = directions.find(d => d.id === directionId);
    return direction?.name || 'Невідомо';
  };

  const getLevelBadge = (level?: number) => {
    const colors = ['bg-gray-100 text-gray-800', 'bg-yellow-100 text-yellow-800', 'bg-orange-100 text-orange-800', 'bg-green-100 text-green-800'];
    const labels = ['Не вказано', 'Початківець', 'Досвідчений', 'Експерт'];
    const idx = level || 0;
    return (
      <Badge variant="secondary" className={colors[idx]}>
        {level ? `${level} - ${labels[level]}` : labels[0]}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Ролі та функціональні напрямки</h2>
          <p className="text-gray-600 mt-1">
            Управління ролями та напрямками діяльності
          </p>
        </div>
      </div>

      {/* Functional Directions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Функціональні напрямки ({directions.length})
            </CardTitle>
            <Dialog open={isDirectionDialogOpen} onOpenChange={setIsDirectionDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => handleOpenDirectionDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Додати напрямок
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingDirection ? 'Редагувати напрямок' : 'Новий напрямок'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitDirection}>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="directionName">Назва напрямку *</Label>
                      <Input
                        id="directionName"
                        value={directionFormData.name}
                        onChange={(e) => setDirectionFormData({ name: e.target.value })}
                        placeholder="Радіозв'язок"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDirectionDialogOpen(false)}>
                      Скасувати
                    </Button>
                    <Button type="submit">
                      {editingDirection ? 'Оновити' : 'Створити'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {directions.map((direction) => {
              const rolesCount = roles.filter(r => r.directionId === direction.id).length;
              return (
                <div
                  key={direction.id}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <span className="font-medium text-blue-900">{direction.name}</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {rolesCount} ролей
                  </Badge>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleOpenDirectionDialog(direction)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleDeleteDirection(direction.id)}
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Roles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              Список ролей ({roles.length})
            </CardTitle>
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenRoleDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Додати роль
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingRole ? 'Редагувати роль' : 'Нова роль'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitRole}>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="roleName">Назва ролі *</Label>
                      <Input
                        id="roleName"
                        value={roleFormData.name}
                        onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                        placeholder="HF-оператор"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="directionId">Функціональний напрямок *</Label>
                      <Select
                        value={roleFormData.directionId}
                        onValueChange={(value) => setRoleFormData({ ...roleFormData, directionId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть напрямок" />
                        </SelectTrigger>
                        <SelectContent>
                          {directions.map((direction) => (
                            <SelectItem key={direction.id} value={direction.id}>
                              {direction.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="level">Рівень експертизи</Label>
                      <Select
                        value={roleFormData.level?.toString()}
                        onValueChange={(value) => setRoleFormData({ ...roleFormData, level: parseInt(value) as 1 | 2 | 3 })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Початківець</SelectItem>
                          <SelectItem value="2">2 - Досвідчений</SelectItem>
                          <SelectItem value="3">3 - Експерт</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                      Скасувати
                    </Button>
                    <Button type="submit">
                      {editingRole ? 'Оновити' : 'Створити'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Назва ролі</TableHead>
                  <TableHead>Функціональний напрямок</TableHead>
                  <TableHead>Рівень експертизи</TableHead>
                  <TableHead className="text-right">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      Ролей немає. Додайте першу роль.
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <span className="font-medium">{role.name}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getDirectionName(role.directionId)}</Badge>
                      </TableCell>
                      <TableCell>{getLevelBadge(role.level)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenRoleDialog(role)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRole(role.id)}
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
