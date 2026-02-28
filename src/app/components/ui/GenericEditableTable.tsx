
import { Card, CardContent } from './card';
import { Check, AlertCircle } from 'lucide-react';
import { Input } from './input';

export type EditableColumnType = 'text' | 'select' | 'date';

export interface EditableColumnOption {
    value: string;
    label: string;
}

export interface EditableColumn<T> {
    id: keyof T | string;
    header: string;
    type: EditableColumnType;
    options?: EditableColumnOption[];
    minWidth?: string;
    placeholder?: string;
}

export interface GenericEditableTableProps<T> {
    data: T[];
    columns: EditableColumn<T>[];
    idField?: keyof T;

    // Selection
    selectedCount?: number;
    toggleAll?: (checked: boolean) => void;
    toggleRowSelection?: (id: string) => void;
    isRowSelected?: (row: T) => boolean;

    // Editing
    updateRowField?: (id: string, field: keyof T, value: string) => void;

    // Validation
    isRowValid?: (row: T) => boolean;
    getRowError?: (row: T, field: keyof T) => boolean;
    getRowErrorTooltip?: (row: T) => string;

    // Customization
    validStatusHeader?: string;
}

export function GenericEditableTable<T extends { [key: string]: any }>({
    data,
    columns,
    idField = 'id' as keyof T,
    selectedCount,
    toggleAll,
    toggleRowSelection,
    isRowSelected,
    updateRowField,
    isRowValid,
    getRowError,
    getRowErrorTooltip,
    validStatusHeader = ''
}: GenericEditableTableProps<T>) {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="w-full overflow-x-auto pb-4">
                    <table className="w-full text-sm text-left border-collapse min-w-max">
                        <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                            <tr>
                                {toggleAll && (
                                    <th className="p-2 w-10 text-center sticky left-0 bg-muted/50 z-10 border-r border-border">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => toggleAll(e.target.checked)}
                                            checked={data.length > 0 && selectedCount !== undefined && selectedCount === data.length}
                                        />
                                    </th>
                                )}
                                {isRowValid && (
                                    <th className="p-2 w-10 sticky left-10 bg-muted/50 z-10 border-r border-border">{validStatusHeader}</th>
                                )}
                                {columns.map((col) => (
                                    <th key={String(col.id)} className="p-2" style={{ minWidth: col.minWidth }}>
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, rowIndex) => {
                                const rowId = String(row[idField]) || String(rowIndex);
                                const valid = isRowValid ? isRowValid(row) : true;
                                const selected = isRowSelected ? isRowSelected(row) : false;

                                return (
                                    <tr key={rowId} className={`border-b border-border ${!valid ? 'bg-destructive/10 hover:bg-destructive/20' : 'hover:bg-muted/30'}`}>
                                        {toggleRowSelection && (
                                            <td className="p-2 text-center sticky left-0 bg-background z-10 border-r border-border shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
                                                <input
                                                    type="checkbox"
                                                    checked={selected}
                                                    onChange={() => toggleRowSelection(rowId)}
                                                />
                                            </td>
                                        )}
                                        {isRowValid && (
                                            <td className="p-2 text-center sticky left-10 bg-background z-10 border-r border-border shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
                                                {valid ? (
                                                    <Check className="w-5 h-5 text-green-500 inline" />
                                                ) : (
                                                    <span title={getRowErrorTooltip ? getRowErrorTooltip(row) : undefined}>
                                                        <AlertCircle className="w-5 h-5 text-destructive inline" />
                                                    </span>
                                                )}
                                            </td>
                                        )}
                                        {columns.map((col) => {
                                            const hasError = getRowError ? getRowError(row, col.id as keyof T) : false;
                                            const value = row[col.id] !== undefined && row[col.id] !== null ? String(row[col.id]) : '';

                                            // Handle special class formatting like specific borders inside the table data wrapper
                                            return (
                                                <td key={String(col.id)} className="p-2">
                                                    {col.type === 'select' ? (
                                                        <select
                                                            value={value}
                                                            onChange={e => updateRowField && updateRowField(rowId, col.id as keyof T, e.target.value)}
                                                            className={`flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm ${hasError ? 'border-destructive' : ''}`}
                                                        >
                                                            <option value="">{col.placeholder || ''}</option>
                                                            {col.options?.map(opt => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </select>
                                                    ) : col.type === 'date' ? (
                                                        <Input
                                                            type="date"
                                                            value={value}
                                                            onChange={e => updateRowField && updateRowField(rowId, col.id as keyof T, e.target.value)}
                                                            className={`h-8 w-full ${hasError ? 'border-destructive' : ''}`}
                                                        />
                                                    ) : (
                                                        <Input
                                                            type="text"
                                                            value={value}
                                                            onChange={e => updateRowField && updateRowField(rowId, col.id as keyof T, e.target.value)}
                                                            className={`h-8 w-full ${hasError ? 'border-destructive' : ''}`}
                                                        />
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
