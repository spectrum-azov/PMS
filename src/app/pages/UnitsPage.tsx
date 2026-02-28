import { useState, useEffect, useCallback } from 'react';
import { useDictionaries } from '../context/DictionariesContext';
import { OrganizationalUnit } from '../types/personnel';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { useLanguage } from '../context/LanguageContext';
import { DataTablePagination } from '../components/ui/DataTablePagination';
import { UnitTable } from '../components/units/UnitTable';
import { UnitDialog } from '../components/units/UnitDialog';
import { getUnits } from '../api/dictionariesApi';

export default function UnitsPage() {
  const { units, addUnit, updateUnit, deleteUnit, reload: reloadAll } = useDictionaries();
  const { t } = useLanguage();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<string | undefined>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [paginatedUnits, setPaginatedUnits] = useState<OrganizationalUnit[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUnits = useCallback(async () => {
    setLoading(true);
    const result = await getUnits({
      page: currentPage,
      pageSize: pageSize,
      sortBy: sortField,
      sortOrder: sortOrder
    });

    if (result.success) {
      setPaginatedUnits(result.data);
      setTotalCount(result.total !== undefined ? result.total : result.data.length);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  }, [currentPage, pageSize, sortField, sortOrder]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

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

    let success = false;
    if (editingUnit) {
      success = await updateUnit(editingUnit.id, formData);
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
      success = await addUnit(newUnit);
      if (success) toast.success(t('units_added'));
    }

    if (success) {
      setIsDialogOpen(false);
      fetchUnits();
      reloadAll();
    }
  };

  const handleDeleteUnit = async (id: string) => {
    if (confirm(t('units_confirm_delete'))) {
      const success = await deleteUnit(id);
      if (success) {
        toast.success(t('units_deleted'));
        fetchUnits();
        reloadAll();
      }
    }
  };

  const getParentName = (parentId?: string) => {
    if (!parentId) return '—';
    const parent = units.find((u) => u.id === parentId);
    return parent?.abbreviation || parent?.name || '—';
  };

  const getTypeBadge = (type?: string) => {
    const colors: Record<string, string> = {
      'Частина': 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-100',
      'Відділ': 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-100',
      'Група': 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-100',
    };

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

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-foreground">{t('units_title')}</h2>
          <p className="text-muted-foreground mt-1">
            {t('units_subtitle')} <span className="font-medium">{totalCount}</span>
          </p>
        </div>
        <UnitDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          editingUnit={editingUnit}
          units={units}
          formData={formData}
          setFormData={setFormData}
          handleOpenDialog={handleOpenDialog}
          handleSubmit={handleSubmit}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {t('units_list')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <UnitTable
              paginatedUnits={paginatedUnits}
              getParentName={getParentName}
              getTypeBadge={getTypeBadge}
              handleOpenDialog={handleOpenDialog}
              handleDelete={handleDeleteUnit}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          )}

          {totalPages > 0 && (
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
