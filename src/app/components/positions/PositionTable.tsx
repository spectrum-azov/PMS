import React from 'react';
import { Position } from '../../types/personnel';
import { useLanguage } from '../../context/LanguageContext';
import { GenericDataTable } from '../ui/GenericDataTable';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Briefcase, Info, Edit, Trash2 } from 'lucide-react';

interface PositionTableProps {
    paginatedPositions: Position[];
    getCategoryBadge: (category: string) => React.ReactNode;
    handleOpenDialog: (position: Position) => void;
    handleDelete: (id: string) => void;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    onSort?: (field: string) => void;
    hasMore?: boolean;
    onLoadMore?: () => void;
    loadingMore?: boolean;
}

export function PositionTable({
    paginatedPositions,
    getCategoryBadge,
    handleOpenDialog,
    handleDelete,
    sortField,
    sortOrder,
    onSort,
    hasMore,
    onLoadMore,
    loadingMore,
}: PositionTableProps) {
    const { t } = useLanguage();

    const columns = [
        {
            id: 'name',
            header: t('positions_col_name'),
            sortable: true,
            render: (position: Position) => (
                <span className="font-medium">{position.name}</span>
            ),
        },
        {
            id: 'category',
            header: t('positions_col_category'),
            sortable: true,
            render: (position: Position) => getCategoryBadge(position.category),
        },
        {
            id: 'description',
            header: t('positions_col_description'),
            sortable: false,
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
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={onSort}
            hasMore={hasMore}
            onLoadMore={onLoadMore}
            loadingMore={loadingMore}
        />
    );
}
