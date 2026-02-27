import { useState } from 'react';
import { useDictionaries } from '../context/DictionariesContext';
import { Position } from '../types/personnel';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';
import { PositionPagination } from '../components/positions/PositionPagination';
import { PositionTable } from '../components/positions/PositionTable';
import { PositionDialog } from '../components/positions/PositionDialog';

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
    category: 'positions_cat_soldier',
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
        category: 'positions_cat_soldier',
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
      'positions_cat_commander': 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-100',
      'positions_cat_sergeant': 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-100',
      'positions_cat_soldier': 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-100',
      'positions_cat_civilian': 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100',
    };

    const translatedCategory = (() => {
      if (category === 'positions_cat_commander') return t('positions_cat_commander');
      if (category === 'positions_cat_sergeant') return t('positions_cat_sergeant');
      if (category === 'positions_cat_soldier') return t('positions_cat_soldier');
      if (category === 'positions_cat_civilian') return t('positions_cat_civilian');
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-foreground">{t('positions_title')}</h2>
          <p className="text-muted-foreground mt-1">
            {t('positions_subtitle')} <span className="font-medium">{positions.length}</span>
          </p>
        </div>
        <PositionDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          editingPosition={editingPosition}
          formData={formData}
          setFormData={setFormData}
          handleOpenDialog={handleOpenDialog}
          handleSubmit={handleSubmit}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {t('positions_list')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <PositionTable
            positions={positions}
            paginatedPositions={paginatedPositions}
            getCategoryBadge={getCategoryBadge}
            handleOpenDialog={handleOpenDialog}
            handleDelete={handleDelete}
          />

          {totalPages > 0 && (
            <PositionPagination
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
