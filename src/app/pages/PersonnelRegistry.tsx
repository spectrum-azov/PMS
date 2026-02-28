import { useNavigate } from 'react-router';
import { usePersonnel } from '../context/PersonnelContext';
import { PersonnelFilters as PersonnelFiltersType } from '../types/personnel';
import { PersonnelFilters } from '../components/personnel/PersonnelFilters';
import { PersonnelTable } from '../components/personnel/PersonnelTable';
import { ColumnId, DEFAULT_COLUMNS } from '../components/personnel/types';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { UserPlus, Download, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect, useTransition } from 'react';
import { DataTablePagination } from '../components/ui/DataTablePagination';
import { Settings2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

const STORAGE_KEY = 'personnel-table-columns';

export default function PersonnelRegistry() {
  const navigate = useNavigate();
  const { filteredPersonnel, filters, setFilters, loading, error, reload } = usePersonnel();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(() => {
    if (typeof window === 'undefined') return 10;
    const saved = localStorage.getItem('personnel-page-size');
    return saved ? parseInt(saved, 10) : 10;
  });

  const [isPending, startTransition] = useTransition();

  const handleFiltersChange = (newFilters: PersonnelFiltersType) => {
    startTransition(() => {
      setFilters(newFilters);
    });
  };

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
    <div className="flex flex-col p-6 gap-6">
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

      <Card className="shrink-0">
        <CardContent className="pt-6">
          <PersonnelFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
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
        <div className="flex flex-col gap-4" style={{ opacity: isPending ? 0.7 : 1, transition: 'opacity 0.2s' }}>
          <div className="w-full relative rounded-md border">
            <PersonnelTable personnel={paginatedPersonnel} visibleColumns={visibleColumns} />
          </div>

          <div className="shrink-0">
            {totalPages > 0 && (
              <DataTablePagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                totalPages={totalPages}
                actions={
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 h-9">
                        <Settings2 className="w-4 h-4" />
                        <span className="hidden sm:inline">{t('table_columns')}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>{t('table_columns_settings')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {columnOptions.map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          checked={isVisible(column.id)}
                          onCheckedChange={() => toggleColumn(column.id)}
                          onSelect={(e) => e.preventDefault()}
                        >
                          {column.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
