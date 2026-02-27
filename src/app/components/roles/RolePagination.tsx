import React from 'react';
import { DataTablePagination } from '../ui/DataTablePagination';

interface RolePaginationProps {
    currentPage: number;
    setCurrentPage: (page: number | ((prev: number) => number)) => void;
    pageSize: number;
    setPageSize: (size: number) => void;
    totalPages: number;
}

export function RolePagination({
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages
}: RolePaginationProps) {
    return (
        <div className="mt-4">
            <DataTablePagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                totalPages={totalPages}
            />
        </div>
    );
}

