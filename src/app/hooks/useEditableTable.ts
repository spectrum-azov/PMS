import { useState, useCallback } from 'react';

export interface UseEditableTableProps<T> {
    initialData?: T[];
    onDataChange?: (data: T[]) => void;
    idField?: keyof T;
    selectionField?: keyof T;
}

export function useEditableTable<T extends Record<string, unknown>>({
    initialData = [],
    onDataChange,
    idField = 'id' as keyof T,
    selectionField = '_selected' as keyof T,
}: UseEditableTableProps<T> = {}) {
    const [data, setDataState] = useState<T[]>(initialData);

    const setData = useCallback((newData: T[] | ((prev: T[]) => T[])) => {
        setDataState((prev) => {
            const resolvedData = typeof newData === 'function' ? newData(prev) : newData;
            if (onDataChange) {
                onDataChange(resolvedData);
            }
            return resolvedData;
        });
    }, [onDataChange]);

    const updateRowField = useCallback((id: string, field: keyof T, value: T[keyof T]) => {
        setData((prev) =>
            prev.map((row) => {
                if (String(row[idField]) === id) {
                    return { ...row, [field]: value };
                }
                return row;
            })
        );
    }, [setData, idField]);

    const toggleRowSelection = useCallback((id: string) => {
        setData((prev) =>
            prev.map((row) => {
                if (String(row[idField]) === id) {
                    return { ...row, [selectionField]: !row[selectionField] };
                }
                return row;
            })
        );
    }, [setData, idField, selectionField]);

    const toggleAll = useCallback((checked: boolean) => {
        setData((prev) => prev.map((row) => ({ ...row, [selectionField]: checked })));
    }, [setData, selectionField]);

    return {
        data,
        setData,
        updateRowField,
        toggleRowSelection,
        toggleAll,
    };
}
