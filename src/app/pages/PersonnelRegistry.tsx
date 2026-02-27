import { useNavigate } from 'react-router';
import { usePersonnel } from '../context/PersonnelContext';
import { PersonnelFilters } from '../components/PersonnelFilters';
import { PersonnelTable } from '../components/PersonnelTable';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { UserPlus, Download, Upload, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Label } from '../components/ui/label';

export function PersonnelRegistry() {
  const navigate = useNavigate();
  const { filteredPersonnel, filters, setFilters, loading, error, reload } = usePersonnel();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const totalPages = Math.ceil(filteredPersonnel.length / pageSize);
  const paginatedPersonnel = filteredPersonnel.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">{t('registry_title')}</h2>
          <div className="text-gray-600 mt-1">
            {loading ? (
              <Skeleton className="h-4 w-32 inline-block" />
            ) : (
              <>{t('registry_found')} <span className="font-medium">{filteredPersonnel.length}</span> {t('registry_records')}</>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('common_import')}</span>
          </Button>
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

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <PersonnelFilters filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      {/* Loading / Error / Table */}
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
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={reload} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('registry_retry')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="page-size" className="text-sm text-gray-600">
                {t('common_show') || 'Show'}:
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
            {totalPages > 1 && (
              <div className="text-sm text-gray-500">
                {t('common_page') || 'Page'} {currentPage} {t('common_of') || 'of'} {totalPages}
              </div>
            )}
          </div>

          <PersonnelTable personnel={paginatedPersonnel} />

          {totalPages > 1 && (
            <div className="flex justify-center py-4">
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
                    // Show first, last, current, and pages around current
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
        </div>
      )}
    </div>
  );
}
