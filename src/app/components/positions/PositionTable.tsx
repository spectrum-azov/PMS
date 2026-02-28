import React from 'react';
import { Position } from '../../types/personnel';
import { useLanguage } from '../../context/LanguageContext';
import { GenericDataTable } from '../ui/GenericDataTable';

interface PositionTableProps {
    positions: Position[];
    paginatedPositions: Position[];
    getCategoryBadge: (category: string) => React.ReactNode;
    handleOpenDialog: (position: Position) => void;
    handleDelete: (id: string) => void;
}

export function PositionTable({
    positions,
    paginatedPositions,
    getCategoryBadge,
    handleOpenDialog,
    handleDelete,
}: PositionTableProps) {
    const { t } = useLanguage();

    const columns = [
        {
            header: t('positions_col_name'),
            render: (position: Position) => (
                <span className="font-medium">{position.name}</span>
            ),
        },
        {
            header: t('positions_col_category'),
            render: (position: Position) => getCategoryBadge(position.category),
        },
        {
            header: t('positions_col_description'),
            render: (position: Position) => (
                <span className="text-sm text-muted-foreground">
                    {position.description || '—'}
                </span>
            ),
        },
    ];

    return (
        <GenericDataTable
            data={paginatedPositions}
            columns={columns}
            onEdit={handleOpenDialog}
            onDelete={(position) => handleDelete(position.id)}
            emptyMessage={t('positions_empty')}
            idField="id"
        />
    );
}
