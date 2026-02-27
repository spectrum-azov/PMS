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
import { useLanguage } from '../context/LanguageContext';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
} from '../components/ui/pagination';

export function RolesPage() {
  const { roles, addRole, updateRole, deleteRole, directions, addDirection, updateDirection, deleteDirection } = useDictionaries();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(roles.length / pageSize);
  const paginatedRoles = roles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
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

  const handleSubmitRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleFormData.name || !roleFormData.directionId) {
      toast.error(t('roles_err_name_required'));
      return;
    }

    if (editingRole) {
      const success = await updateRole(editingRole.id, roleFormData);
      if (success) toast.success(t('roles_updated'));
    } else {
      const newRole: Role = {
        id: `role-${Date.now()}`,
        name: roleFormData.name!,
        directionId: roleFormData.directionId!,
        level: roleFormData.level,
      };
      const success = await addRole(newRole);
      if (success) toast.success(t('roles_added'));
    }

    setIsRoleDialogOpen(false);
  };

  const handleSubmitDirection = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!directionFormData.name) {
      toast.error(t('roles_err_dir_name_required'));
      return;
    }

    if (editingDirection) {
      const success = await updateDirection(editingDirection.id, directionFormData);
      if (success) toast.success(t('roles_direction_updated'));
    } else {
      const success = await addDirection({
        id: `dir-${Date.now()}`,
        name: directionFormData.name,
      });
      if (success) toast.success(t('roles_direction_added'));
    }

    setIsDirectionDialogOpen(false);
  };

  const handleDeleteRole = async (id: string) => {
    if (confirm(t('roles_confirm_delete_role'))) {
      const success = await deleteRole(id);
      if (success) toast.success(t('roles_deleted'));
    }
  };

  const handleDeleteDirection = async (id: string) => {
    const hasRoles = roles.some(r => r.directionId === id);
    if (hasRoles) {
      toast.error(t('roles_err_dir_has_roles'));
      return;
    }
    if (confirm(t('roles_confirm_delete_dir'))) {
      const success = await deleteDirection(id);
      if (success) toast.success(t('roles_direction_deleted'));
    }
  };

  const getDirectionName = (directionId: string) => {
    const direction = directions.find(d => d.id === directionId);
    return direction?.name || t('common_unknown');
  };

  const getLevelBadge = (level?: number) => {
    const colors = ['bg-gray-100 text-gray-800', 'bg-yellow-100 text-yellow-800', 'bg-orange-100 text-orange-800', 'bg-green-100 text-green-800'];
    const labels = [t('roles_level_none'), t('roles_level_beginner'), t('roles_level_experienced'), t('roles_level_expert')];
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
          <h2 className="text-3xl font-semibold text-foreground">{t('roles_title')}</h2>
          <p className="text-muted-foreground mt-1">
            {t('roles_subtitle')}
          </p>
        </div>
      </div>

      {/* Functional Directions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              {t('roles_directions_title')} ({directions.length})
            </CardTitle>
            <Dialog open={isDirectionDialogOpen} onOpenChange={setIsDirectionDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => handleOpenDirectionDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('roles_add_direction')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingDirection ? t('roles_dialog_edit_direction') : t('roles_dialog_add_direction')}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitDirection}>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="directionName">{t('roles_direction_name')}</Label>
                      <Input
                        id="directionName"
                        value={directionFormData.name}
                        onChange={(e) => setDirectionFormData({ name: e.target.value })}
                        placeholder=""
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDirectionDialogOpen(false)}>
                      {t('common_cancel')}
                    </Button>
                    <Button type="submit">
                      {editingDirection ? t('common_update') : t('common_create')}
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
                    {rolesCount} {t('roles_roles')}
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
              {t('roles_roles_title')} ({roles.length})
            </CardTitle>
            <div className="flex items-center justify-gap-2">
              <div className="flex items-center gap-2 mr-4">
                <Label htmlFor="page-size" className="text-sm text-muted-foreground">
                  {t('common_show') || 'Показати'}:
                </Label>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(val) => {
                    setPageSize(parseInt(val));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger id="page-size" className="w-[80px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenRoleDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('roles_add_role')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingRole ? t('roles_dialog_edit_role') : t('roles_dialog_add_role')}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitRole}>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="roleName">{t('roles_role_name')}</Label>
                        <Input
                          id="roleName"
                          value={roleFormData.name}
                          onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                          placeholder=""
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="directionId">{t('roles_functional_direction')}</Label>
                        <Select
                          value={roleFormData.directionId}
                          onValueChange={(value) => setRoleFormData({ ...roleFormData, directionId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('roles_select_direction')} />
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
                        <Label htmlFor="level">{t('roles_expertise_level')}</Label>
                        <Select
                          value={roleFormData.level?.toString()}
                          onValueChange={(value) => setRoleFormData({ ...roleFormData, level: parseInt(value) as 1 | 2 | 3 })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 - {t('roles_level_beginner')}</SelectItem>
                            <SelectItem value="2">2 - {t('roles_level_experienced')}</SelectItem>
                            <SelectItem value="3">3 - {t('roles_level_expert')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                        {t('common_cancel')}
                      </Button>
                      <Button type="submit">
                        {editingRole ? t('common_update') : t('common_create')}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('roles_col_name')}</TableHead>
                  <TableHead>{t('roles_col_direction')}</TableHead>
                  <TableHead>{t('roles_col_level')}</TableHead>
                  <TableHead className="text-right">{t('common_actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      {t('roles_empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRoles.map((role) => (
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

          {totalPages > 1 && (
            <div className="flex justify-center py-4 mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationFirst
                      onClick={() => setCurrentPage(1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={currentPage === page}
                            onClick={() => setCurrentPage(page)}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    if (
                      (page === 2 && currentPage > 3) ||
                      (page === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLast
                      onClick={() => setCurrentPage(totalPages)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
