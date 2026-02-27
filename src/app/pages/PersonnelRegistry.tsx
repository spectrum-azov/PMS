import { useNavigate } from 'react-router';
import { usePersonnel } from '../context/PersonnelContext';
import { PersonnelFilters } from '../components/personnel/PersonnelFilters';
import { PersonnelTable, ColumnId, DEFAULT_COLUMNS } from '../components/personnel/PersonnelTable';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { UserPlus, Download, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { RegistryPagination } from '../components/personnel/RegistryPagination';

const STORAGE_KEY = 'personnel-table-columns';

export function PersonnelRegistry() {
  const navigate = useNavigate();
  const { filteredPersonnel, filters, setFilters, loading, error, reload } = usePersonnel();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(() => {
    if (typeof window === 'undefined') return 10;
    const saved = localStorage.getItem('personnel-page-size');
    return saved ? parseInt(saved, 10) : 10;
  });

  useEffect(() => {
    localStorage.setItem('personnel-page-size', pageSize.toString());
  }, [pageSize]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_COLUMNS;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_COLUMNS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const toggleColumn = (column: ColumnId) => {
    setVisibleColumns(prev =>
      prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const isVisible = (column: ColumnId) => visibleColumns.includes(column);

  const columnOptions: { id: ColumnId; label: string }[] = [
    { id: 'callsign', label: t('table_col_callsign') },
    { id: 'fullname', label: t('table_col_fullname') },
    { id: 'rank', label: t('table_col_rank') },
    { id: 'unit', label: t('table_col_unit') },
    { id: 'position', label: t('table_col_position') },
    { id: 'roles', label: t('table_col_roles') },
    { id: 'service_type', label: t('table_col_service_type') },
    { id: 'status', label: t('table_col_status') },
    { id: 'phone', label: t('table_col_phone') },
  ];

  const totalPages = Math.ceil(filteredPersonnel.length / pageSize);
  const paginatedPersonnel = filteredPersonnel.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-foreground">{t('registry_title')}</h2>
          <div className="text-muted-foreground mt-1">
            {loading ? (
              <Skeleton className="h-4 w-32 inline-block" />
            ) : (
              <>{t('registry_found')} <span className="font-medium">{filteredPersonnel.length}</span> {t('registry_records')}</>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('common_export')}</span>
          </Button>
          <Button onClick={() => navigate('/personnel/new')}>
            <UserPlus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('registry_add_person')}</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <PersonnelFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="py-8 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={reload} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('registry_retry')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <PersonnelTable personnel={paginatedPersonnel} visibleColumns={visibleColumns} />

          {totalPages > 0 && (
            <RegistryPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalPages={totalPages}
              visibleColumns={visibleColumns}
              toggleColumn={toggleColumn}
              isVisible={isVisible}
              columnOptions={columnOptions}
            />
          )}
        </div>
      )}
    </div>
  );
}
