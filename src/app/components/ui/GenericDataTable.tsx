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
import { Card, CardContent } from './card';

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
    onRowClick?: (item: T) => void;
    renderMobileCard?: (item: T) => React.ReactNode;
    renderActions?: (item: T) => React.ReactNode;
    emptyMessage?: string;
    idField?: keyof T;
}

export function GenericDataTable<T>({
    data,
    columns,
    onEdit,
    onDelete,
    onRowClick,
    renderMobileCard,
    renderActions,
    emptyMessage,
    idField = 'id' as keyof T,
}: GenericDataTableProps<T>) {
    const { t } = useLanguage();

    return (
        <div className="space-y-4">
            {/* Mobile View - Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {data.length === 0 ? (
                    <Card className="bg-card">
                        <CardContent className="py-8 text-center text-muted-foreground">
                            {emptyMessage || t('common_no_data')}
                        </CardContent>
                    </Card>
                ) : (
                    data.map((item, index) => (
                        <div key={String(item[idField]) || index}>
                            {renderMobileCard ? (
                                renderMobileCard(item)
                            ) : (
                                <Card className="bg-card">
                                    <CardContent className="p-4 space-y-2">
                                        {columns.map((col, i) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">{col.header}</span>
                                                <span className="font-medium">{col.render(item)}</span>
                                            </div>
                                        ))}
                                        {(onEdit || onDelete || renderActions) && (
                                            <div className="flex justify-end gap-2 pt-2 border-t mt-2">
                                                {renderActions ? renderActions(item) : (
                                                    <>
                                                        {onEdit && (
                                                            <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        {onDelete && (
                                                            <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
                                                                <Trash2 className="w-4 h-4 text-destructive" />
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block border rounded-lg overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableHead key={index} className={column.className}>
                                    {column.header}
                                </TableHead>
                            ))}
                            {(onEdit || onDelete || renderActions) && (
                                <TableHead className="text-right">{t('common_actions')}</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (onEdit || onDelete || renderActions ? 1 : 0)}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    {emptyMessage || t('common_no_data')}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, rowIndex) => (
                                <TableRow
                                    key={String(item[idField]) || rowIndex}
                                    className={onRowClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}
                                    onClick={() => onRowClick && onRowClick(item)}
                                >
                                    {columns.map((column, colIndex) => (
                                        <TableCell key={colIndex} className={column.className}>
                                            {column.render(item)}
                                        </TableCell>
                                    ))}
                                    {(onEdit || onDelete || renderActions) && (
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-end gap-2">
                                                {renderActions ? renderActions(item) : (
                                                    <>
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
                                                    </>
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
        </div>
    );
}
