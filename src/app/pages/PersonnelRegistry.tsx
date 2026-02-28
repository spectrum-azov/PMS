import { useNavigate } from 'react-router';
import { usePersonnel } from '../context/PersonnelContext';
import { useSettings } from '../context/SettingsContext';
import { PersonnelFilters as PersonnelFiltersType } from '../types/personnel';
import { PersonnelFilters } from '../components/personnel/PersonnelFilters';
import { PersonnelTable } from '../components/personnel/PersonnelTable';
import { ColumnId, DEFAULT_COLUMNS } from '../components/personnel/types';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { UserPlus, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect, useTransition, useCallback, useRef } from 'react';
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
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import * as api from '../api/personnelApi';
import { Person } from '../types/personnel';

const STORAGE_KEY = 'personnel-table-columns';

export default function PersonnelRegistry() {
  const navigate = useNavigate();
  const { filteredPersonnel, filters, setFilters, totalCount, loading, error, reload } = usePersonnel();
  const { settings } = useSettings();
  const { t } = useLanguage();
  const isInfiniteScroll = settings.tableDisplayMode === 'infiniteScroll';

  // When mounting in pagination mode and context has no data, trigger a fetch.
  // We use a ref to prevent StrictMode double-firing, and we update filters
  // to leverage the context's debounce rather than calling reload() directly,
  // which guarantees exactly 1 API call.
  const isMountFiredInfo = useRef(false);
  useEffect(() => {
    if (!isMountFiredInfo.current && !isInfiniteScroll && filteredPersonnel.length === 0) {
      isMountFiredInfo.current = true;
      setFilters(prev => ({ ...prev }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInfiniteScroll]);

  const currentPage = filters.page || 1;
  const pageSize = filters.pageSize || 25;

  const [isPending, startTransition] = useTransition();

  const handleFiltersChange = (newFilters: PersonnelFiltersType) => {
    startTransition(() => {
      setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    });
  };

  const setCurrentPage = (page: number | ((prev: number) => number)) => {
    setFilters(prev => ({
      ...prev,
      page: typeof page === 'function' ? page(prev.page || 1) : page
    }));
  };

  const setPageSize = (size: number) => {
    setFilters(prev => ({ ...prev, pageSize: size, page: 1 }));
    localStorage.setItem('personnel-page-size', size.toString());
  };

  const handleSort = (field: string) => {
    setFilters(prev => {
      if (prev.sortBy === field) {
        return {
          ...prev,
          sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
          page: 1
        };
      }
      return {
        ...prev,
        sortBy: field,
        sortOrder: 'asc' as const,
        page: 1
      };
    });
  };

  // Infinite scroll fetch function
  const fetchForInfiniteScroll = useCallback(async (page: number, ps: number) => {
    const result = await api.getPersonnel({
      ...filters,
      page,
      pageSize: ps,
    });
    if (result.success) {
      return { data: result.data, total: result.total ?? result.data.length };
    }
    return { data: [] as Person[], total: 0 };
  }, [filters.search, filters.unitId, filters.positionId, filters.status, filters.serviceType, filters.roleId, filters.sortBy, filters.sortOrder]);

  const infiniteScroll = useInfiniteScroll<Person>({
    fetchFn: fetchForInfiniteScroll,
    pageSize,
    deps: [fetchForInfiniteScroll],
    enabled: isInfiniteScroll,
  });

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

  const totalPages = Math.ceil(totalCount / pageSize);

  // Choose data source based on display mode
  const displayData = isInfiniteScroll ? infiniteScroll.items : filteredPersonnel;
  const displayTotalCount = isInfiniteScroll ? infiniteScroll.totalCount : totalCount;
  const isLoading = isInfiniteScroll ? (infiniteScroll.loadingMore && infiniteScroll.items.length === 0) : loading;

  return (
    <div className="flex flex-col p-6 gap-6">
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-foreground">{t('registry_title')}</h2>
          <div className="text-muted-foreground mt-1">
            {isLoading ? (
              <Skeleton className="h-4 w-32 inline-block" />
            ) : (
              <>{t('registry_found')} <span className="font-medium">{displayTotalCount}</span> {t('registry_records')}</>
            )}
          </div>
        </div>
        <div className="flex gap-2">
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

      {isLoading ? (
        <Card>
          <CardContent className="py-8 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : error && !isInfiniteScroll ? (
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
            <PersonnelTable
              personnel={displayData}
              visibleColumns={visibleColumns}
              sortField={filters.sortBy}
              sortOrder={filters.sortOrder}
              onSort={handleSort}
              hasMore={isInfiniteScroll ? infiniteScroll.hasMore : undefined}
              onLoadMore={isInfiniteScroll ? infiniteScroll.loadMore : undefined}
              loadingMore={isInfiniteScroll ? infiniteScroll.loadingMore : undefined}
            />
          </div>

          {!isInfiniteScroll && (
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
          )}
        </div>
      )}
    </div>
  );
}
