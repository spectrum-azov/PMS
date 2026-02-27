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

export function UnitsPage() {
  const { units, addUnit, updateUnit, deleteUnit } = useDictionaries();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(units.length / pageSize);
  const paginatedUnits = units.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error(t('units_err_name_required'));
      return;
    }

    if (editingUnit) {
      const success = await updateUnit(editingUnit.id, formData);
      if (success) toast.success(t('units_updated'));
    } else {
      const newUnit: OrganizationalUnit = {
        id: `unit-${Date.now()}`,
        name: formData.name!,
        abbreviation: formData.abbreviation,
        type: formData.type,
        location: formData.location,
        parentId: formData.parentId || undefined,
      };
      const success = await addUnit(newUnit);
      if (success) toast.success(t('units_added'));
    }

    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('units_confirm_delete'))) {
      const success = await deleteUnit(id);
      if (success) toast.success(t('units_deleted'));
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

    // translate the unit type
    const translatedType = (() => {
      if (type === 'Частина') return t('units_type_part');
      if (type === 'Відділ') return t('units_type_dept');
      if (type === 'Група') return t('units_type_group');
      return type || t('common_not_specified');
    })();

    return (
      <Badge variant="secondary" className={colors[type || ''] || ''}>
        {translatedType}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-foreground">{t('units_title')}</h2>
          <p className="text-muted-foreground mt-1">
            {t('units_subtitle')} <span className="font-medium">{units.length}</span>
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              {t('units_add')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUnit ? t('units_dialog_edit') : t('units_dialog_add')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">{t('units_name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Група мереж та ІТ"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="abbreviation">{t('units_abbreviation')}</Label>
                  <Input
                    id="abbreviation"
                    value={formData.abbreviation}
                    onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                    placeholder="IT"
                  />
                </div>

                <div>
                  <Label htmlFor="type">{t('units_type')}</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Частина">{t('units_type_part')}</SelectItem>
                      <SelectItem value="Відділ">{t('units_type_dept')}</SelectItem>
                      <SelectItem value="Група">{t('units_type_group')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">{t('units_location')}</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Київ"
                  />
                </div>

                <div>
                  <Label htmlFor="parentId">{t('units_parent')}</Label>
                  <Select
                    value={formData.parentId || 'none'}
                    onValueChange={(value) => setFormData({ ...formData, parentId: value === 'none' ? undefined : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('units_no_parent')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t('units_no_parent')}</SelectItem>
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
                  {t('common_cancel')}
                </Button>
                <Button type="submit">
                  {editingUnit ? t('common_update') : t('common_create')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {t('units_list')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('units_col_abbrev')}</TableHead>
                  <TableHead>{t('units_col_name')}</TableHead>
                  <TableHead>{t('units_col_type')}</TableHead>
                  <TableHead>{t('units_col_parent')}</TableHead>
                  <TableHead>{t('units_col_location')}</TableHead>
                  <TableHead className="text-right">{t('common_actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {t('units_empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUnits.map((unit) => (
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
                        <span className="text-sm text-muted-foreground">
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

          {totalPages > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between py-4 mt-4 gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
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
                <div className="text-sm text-muted-foreground">
                  {t('common_page') || 'Сторінка'} {currentPage} {t('common_of') || 'з'} {totalPages}
                </div>
              </div>

              {totalPages > 1 && (
                <Pagination className="mx-0 w-auto">
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
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
