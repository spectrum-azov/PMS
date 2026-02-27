import React from 'react';
import { DataTablePagination } from '../ui/DataTablePagination';

interface UnitPaginationProps {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    pageSize: number;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
}

export function UnitPagination({
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
}: UnitPaginationProps) {
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

