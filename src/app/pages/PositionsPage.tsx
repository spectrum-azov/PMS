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

export function PositionsPage() {
  const { positions, addPosition, updatePosition, deletePosition } = useDictionaries();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(positions.length / pageSize);
  const paginatedPositions = positions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category) {
      toast.error(t('positions_err_required'));
      return;
    }

    if (editingPosition) {
      const success = await updatePosition(editingPosition.id, formData);
      if (success) toast.success(t('positions_updated'));
    } else {
      const newPosition: Position = {
        id: `pos-${Date.now()}`,
        name: formData.name!,
        category: formData.category as any,
        description: formData.description,
      };
      const success = await addPosition(newPosition);
      if (success) toast.success(t('positions_added'));
    }

    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('positions_confirm_delete'))) {
      const success = await deletePosition(id);
      if (success) toast.success(t('positions_deleted'));
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'Командир': 'bg-red-100 text-red-800',
      'Сержант': 'bg-orange-100 text-orange-800',
      'Солдат': 'bg-blue-100 text-blue-800',
      'Цивільний': 'bg-gray-100 text-gray-800',
    };

    const translatedCategory = (() => {
      if (category === 'Командир') return t('positions_cat_commander');
      if (category === 'Сержант') return t('positions_cat_sergeant');
      if (category === 'Солдат') return t('positions_cat_soldier');
      if (category === 'Цивільний') return t('positions_cat_civilian');
      return category;
    })();

    return (
      <Badge variant="secondary" className={colors[category] || ''}>
        {translatedCategory}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">{t('positions_title')}</h2>
          <p className="text-gray-600 mt-1">
            {t('positions_subtitle')} <span className="font-medium">{positions.length}</span>
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              {t('positions_add')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPosition ? t('positions_dialog_edit') : t('positions_dialog_add')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">{t('positions_name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder=""
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">{t('positions_category')}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Командир">{t('positions_cat_commander')}</SelectItem>
                      <SelectItem value="Сержант">{t('positions_cat_sergeant')}</SelectItem>
                      <SelectItem value="Солдат">{t('positions_cat_soldier')}</SelectItem>
                      <SelectItem value="Цивільний">{t('positions_cat_civilian')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">{t('positions_description')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder=""
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common_cancel')}
                </Button>
                <Button type="submit">
                  {editingPosition ? t('common_update') : t('common_create')}
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
              <Briefcase className="w-5 h-5" />
              {t('positions_list')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="page-size" className="text-sm text-gray-600">
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('positions_col_name')}</TableHead>
                  <TableHead>{t('positions_col_category')}</TableHead>
                  <TableHead>{t('positions_col_description')}</TableHead>
                  <TableHead className="text-right">{t('common_actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      {t('positions_empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPositions.map((position) => (
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
