import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Label } from './label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './select';
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
} from './pagination';

interface DataTablePaginationProps {
    currentPage: number;
    setCurrentPage: (page: number | ((prev: number) => number)) => void;
    pageSize: number;
    setPageSize: (size: number) => void;
    totalPages: number;
    actions?: React.ReactNode;
}

export function DataTablePagination({
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    actions,
}: DataTablePaginationProps) {
    const { t } = useLanguage();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center py-4 gap-4">
            <div className="flex items-center gap-4 justify-center sm:justify-start">
                <div className="flex items-center gap-2">
                    <Label htmlFor="page-size" className="text-sm text-muted-foreground">
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
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                    {t('common_page') || 'Page'} {currentPage} {t('common_of') || 'of'} {totalPages}
                </div>
            </div>

            <div className="flex items-center justify-center">
                {totalPages > 1 && (
                    <Pagination className="mx-0 w-auto">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationFirst
                                    onClick={() => setCurrentPage(1)}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLast
                                    onClick={() => setCurrentPage(totalPages)}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>

            <div className="flex items-center justify-center sm:justify-end">
                {actions}
            </div>
        </div>
    );
}
