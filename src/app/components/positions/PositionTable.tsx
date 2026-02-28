import React from 'react';
import { Position } from '../../types/personnel';
import { useLanguage } from '../../context/LanguageContext';
import { GenericDataTable } from '../ui/GenericDataTable';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Briefcase, Info, Edit, Trash2 } from 'lucide-react';

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

    const renderMobileCard = (position: Position) => (
        <Card className="overflow-hidden border-border bg-card hover:border-primary/50 transition-colors">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <div className="font-bold text-lg text-foreground leading-tight">
                            {position.name}
                        </div>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleOpenDialog(position)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => handleDelete(position.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4">
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mr-1">
                        {t('positions_col_category')}:
                    </span>
                    {getCategoryBadge(position.category)}
                </div>

                {position.description && (
                    <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg border border-border/50">
                        <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="text-sm text-muted-foreground italic">
                            {position.description}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <GenericDataTable
            data={paginatedPositions}
            columns={columns}
            onEdit={handleOpenDialog}
            onDelete={(position) => handleDelete(position.id)}
            renderMobileCard={renderMobileCard}
            emptyMessage={t('positions_empty')}
            idField="id"
        />
    );
}
