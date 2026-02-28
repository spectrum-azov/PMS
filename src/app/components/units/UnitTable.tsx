import React from 'react';
import { OrganizationalUnit } from '../../types/personnel';
import { useLanguage } from '../../context/LanguageContext';
import { GenericDataTable } from '../ui/GenericDataTable';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Shield, MapPin, Building2, Edit, Trash2 } from 'lucide-react';

interface UnitTableProps {
    paginatedUnits: OrganizationalUnit[];
    getParentName: (parentId?: string) => string;
    getTypeBadge: (type?: string) => React.ReactNode;
    handleOpenDialog: (unit: OrganizationalUnit) => void;
    handleDelete: (id: string) => void;
}

export function UnitTable({
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

    // ... inside UnitTable component ...

    const renderMobileCard = (unit: OrganizationalUnit) => (
        <Card className="overflow-hidden border-border bg-card hover:border-primary/50 transition-colors">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <div className="font-mono font-bold text-lg text-primary leading-tight">
                            {unit.abbreviation || '—'}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            {unit.type}
                        </div>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleOpenDialog(unit)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => handleDelete(unit.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4">
                <div className="font-semibold text-foreground">
                    {unit.name}
                </div>

                <div className="grid grid-cols-1 gap-2 bg-muted/30 p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 text-sm">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground mr-1">{t('units_col_parent')}:</span>
                        <span className="font-medium">{getParentName(unit.parentId)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground mr-1">{t('units_col_location')}:</span>
                        <span className="font-medium">{unit.location || '—'}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <GenericDataTable
            data={paginatedUnits}
            columns={columns}
            onEdit={handleOpenDialog}
            onDelete={(unit) => handleDelete(unit.id)}
            renderMobileCard={renderMobileCard}
            emptyMessage={t('units_empty')}
            idField="id"
        />
    );
}
