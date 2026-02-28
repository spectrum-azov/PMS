import { useState, useEffect, useCallback } from 'react';
import { useDictionaries } from '../context/DictionariesContext';
import { useSettings } from '../context/SettingsContext';
import { Role } from '../types/personnel';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { UserCog, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { useLanguage } from '../context/LanguageContext';
import { RolesTable } from '../components/roles/RolesTable';
import { DirectionDialog } from '../components/roles/DirectionDialog';
import { RoleDialog } from '../components/roles/RoleDialog';
import { DataTablePagination } from '../components/ui/DataTablePagination';
import { Button } from '../components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { getRoles } from '../api/dictionariesApi';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

export default function RolesPage() {
  const { roles, addRole, updateRole, deleteRole, directions, addDirection, updateDirection, deleteDirection, reload: reloadAll } = useDictionaries();
  const { settings } = useSettings();
  const { t } = useLanguage();
  const isInfiniteScroll = settings.tableDisplayMode === 'infiniteScroll';

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<string | undefined>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [paginatedRoles, setPaginatedRoles] = useState<Role[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const fetchRoles = useCallback(async () => {
    setLoadingRoles(true);
    const result = await getRoles({ page: currentPage, pageSize, sortBy: sortField, sortOrder });
    if (result.success) {
      setPaginatedRoles(result.data);
      setTotalCount(result.total !== undefined ? result.total : result.data.length);
    } else {
      toast.error(result.message);
    }
    setLoadingRoles(false);
  }, [currentPage, pageSize, sortField, sortOrder]);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Infinite scroll
  const fetchForInfiniteScroll = useCallback(async (pg: number, ps: number) => {
    const result = await getRoles({ page: pg, pageSize: ps, sortBy: sortField, sortOrder });
    if (result.success) {
      return { data: result.data, total: result.total ?? result.data.length };
    }
    return { data: [] as Role[], total: 0 };
  }, [sortField, sortOrder]);

  const infiniteScrollData = useInfiniteScroll<Role>({
    fetchFn: fetchForInfiniteScroll,
    pageSize,
    deps: [fetchForInfiniteScroll],
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  const displayData = isInfiniteScroll ? infiniteScrollData.items : paginatedRoles;
  const displayTotalCount = isInfiniteScroll ? infiniteScrollData.totalCount : totalCount;
  const isLoading = isInfiniteScroll ? (infiniteScrollData.loadingMore && infiniteScrollData.items.length === 0) : loadingRoles;

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

  const handleSubmitRole = async (formData: Partial<Role>) => {
    if (!formData.name || !formData.directionId) {
      toast.error(t('roles_err_name_required'));
      return;
    }

    let success = false;
    if (editingRole) {
      success = await updateRole(editingRole.id, formData);
      if (success) toast.success(t('roles_updated'));
    } else {
      const newRole: Role = {
        id: `role-${Date.now()}`,
        name: formData.name!,
        directionId: formData.directionId!,
        level: formData.level,
      };
      success = await addRole(newRole);
      if (success) toast.success(t('roles_added'));
    }

    if (success) {
      setIsRoleDialogOpen(false);
      fetchRoles();
      reloadAll();
    }
  };

  const handleSubmitDirection = async (formData: { name: string }) => {
    if (!formData.name) {
      toast.error(t('roles_err_dir_name_required'));
      return;
    }

    if (editingDirection) {
      const success = await updateDirection(editingDirection.id, formData);
      if (success) toast.success(t('roles_direction_updated'));
    } else {
      const success = await addDirection({
        id: `dir-${Date.now()}`,
        name: formData.name,
      });
      if (success) toast.success(t('roles_direction_added'));
    }

    setIsDirectionDialogOpen(false);
  };

  const handleDeleteRole = async (id: string) => {
    if (confirm(t('roles_confirm_delete_role'))) {
      const success = await deleteRole(id);
      if (success) {
        toast.success(t('roles_deleted'));
        fetchRoles();
        reloadAll();
      }
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
    const colors = ['bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100', 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-100', 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-100', 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-100'];
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-foreground">{t('roles_title')}</h2>
          <p className="text-muted-foreground mt-1">
            {t('roles_subtitle')}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              {t('roles_directions_title')} ({directions.length})
            </CardTitle>
            <DirectionDialog
              isOpen={isDirectionDialogOpen}
              setIsOpen={setIsDirectionDialogOpen}
              editingDirection={editingDirection}
              directionFormData={directionFormData}
              setDirectionFormData={setDirectionFormData}
              onSave={handleSubmitDirection}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {directions.map((direction) => {
              const rolesCount = roles.filter(r => r.directionId === direction.id).length;
              return (
                <div
                  key={direction.id}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary/40 border border-border rounded-lg"
                >
                  <span className="font-medium text-foreground">{direction.name}</span>
                  <Badge variant="outline" className="bg-background text-foreground shrink-0 border-border">
                    {rolesCount} {t('roles_roles')}
                  </Badge>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-muted"
                      onClick={() => handleOpenDirectionDialog(direction)}
                    >
                      <Edit className="w-3 h-3 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-destructive/10"
                      onClick={() => handleDeleteDirection(direction.id)}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              {t('roles_roles_title')} ({roles.length})
            </CardTitle>
            <RoleDialog
              isOpen={isRoleDialogOpen}
              setIsOpen={setIsRoleDialogOpen}
              editingRole={editingRole}
              roleFormData={roleFormData}
              setRoleFormData={setRoleFormData}
              onSave={handleSubmitRole}
              directions={directions}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <RolesTable
              paginatedRoles={displayData}
              getDirectionName={getDirectionName}
              getLevelBadge={getLevelBadge}
              handleOpenRoleDialog={handleOpenRoleDialog}
              handleDeleteRole={handleDeleteRole}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
              hasMore={isInfiniteScroll ? infiniteScrollData.hasMore : undefined}
              onLoadMore={isInfiniteScroll ? infiniteScrollData.loadMore : undefined}
              loadingMore={isInfiniteScroll ? infiniteScrollData.loadingMore : undefined}
            />
          )}

          {!isInfiniteScroll && totalPages > 0 && (
            <DataTablePagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalPages={totalPages}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
