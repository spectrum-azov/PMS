import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Settings2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ColumnId } from './types';
import { DataTablePagination } from '../ui/DataTablePagination';

interface RegistryPaginationProps {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    pageSize: number;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
    visibleColumns: ColumnId[];
    toggleColumn: (column: ColumnId) => void;
    isVisible: (column: ColumnId) => boolean;
    columnOptions: { id: ColumnId; label: string }[];
}

export function RegistryPagination({
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    visibleColumns,
    toggleColumn,
    isVisible,
    columnOptions,
}: RegistryPaginationProps) {
    const { t } = useLanguage();

    const columnSettings = (
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
    );

    return (
        <DataTablePagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            actions={columnSettings}
        />
    );
}

