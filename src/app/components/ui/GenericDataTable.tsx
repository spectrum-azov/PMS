import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from './button';
import { Edit, Trash2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './table';

interface Column<T> {
    header: string;
    render: (item: T) => React.ReactNode;
    className?: string;
}

interface GenericDataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    emptyMessage?: string;
    idField?: keyof T;
}

export function GenericDataTable<T>({
    data,
    columns,
    onEdit,
    onDelete,
    emptyMessage,
    idField = 'id' as keyof T,
}: GenericDataTableProps<T>) {
    const { t } = useLanguage();

    return (
        <div className="border rounded-lg overflow-hidden bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column, index) => (
                            <TableHead key={index} className={column.className}>
                                {column.header}
                            </TableHead>
                        ))}
                        {(onEdit || onDelete) && (
                            <TableHead className="text-right">{t('common_actions')}</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                                className="text-center py-8 text-muted-foreground"
                            >
                                {emptyMessage || t('common_no_data')}
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, rowIndex) => (
                            <TableRow key={String(item[idField]) || rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <TableCell key={colIndex} className={column.className}>
                                        {column.render(item)}
                                    </TableCell>
                                ))}
                                {(onEdit || onDelete) && (
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {onEdit && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onEdit(item)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            )}
                                            {onDelete && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onDelete(item)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
