import React from 'react';
import { OrganizationalUnit } from '../../types/personnel';
import { useLanguage } from '../../context/LanguageContext';
import { GenericDataTable } from '../ui/GenericDataTable';

interface UnitTableProps {
    units: OrganizationalUnit[];
    paginatedUnits: OrganizationalUnit[];
    getParentName: (parentId?: string) => string;
    getTypeBadge: (type?: string) => React.ReactNode;
    handleOpenDialog: (unit: OrganizationalUnit) => void;
    handleDelete: (id: string) => void;
}

export function UnitTable({
    units,
    paginatedUnits,
    getParentName,
    getTypeBadge,
    handleOpenDialog,
    handleDelete,
}: UnitTableProps) {
    const { t } = useLanguage();

    const columns = [
        {
            header: t('units_col_abbrev'),
            render: (unit: OrganizationalUnit) => (
                <span className="font-medium text-primary font-mono">
                    {unit.abbreviation || '—'}
                </span>
            ),
        },
        {
            header: t('units_col_name'),
            render: (unit: OrganizationalUnit) => (
                <span className="font-medium">{unit.name}</span>
            ),
        },
        {
            header: t('units_col_type'),
            render: (unit: OrganizationalUnit) => getTypeBadge(unit.type),
        },
        {
            header: t('units_col_parent'),
            render: (unit: OrganizationalUnit) => (
                <span className="text-sm text-muted-foreground">
                    {getParentName(unit.parentId)}
                </span>
            ),
        },
        {
            header: t('units_col_location'),
            render: (unit: OrganizationalUnit) => (
                <span className="text-sm">{unit.location || '—'}</span>
            ),
        },
    ];

    return (
        <GenericDataTable
            data={paginatedUnits}
            columns={columns}
            onEdit={handleOpenDialog}
            onDelete={(unit) => handleDelete(unit.id)}
            emptyMessage={t('units_empty')}
            idField="id"
        />
    );
}
