import React from 'react';
import { DataTablePagination } from '../ui/DataTablePagination';

interface PositionPaginationProps {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    pageSize: number;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
}

export function PositionPagination({
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
}: PositionPaginationProps) {
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
