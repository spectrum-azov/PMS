import React from 'react';
import { Role } from '../../types/personnel';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../context/LanguageContext';
import { GenericDataTable } from '../ui/GenericDataTable';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Award, Layers, Edit, Trash2 } from 'lucide-react';

interface RolesTableProps {
    paginatedRoles: Role[];
    getDirectionName: (id: string) => string;
    getLevelBadge: (level?: number) => React.ReactNode;
    handleOpenRoleDialog: (role: Role) => void;
    handleDeleteRole: (id: string) => void;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    onSort?: (field: string) => void;
}

export function RolesTable({
    paginatedRoles,
    getDirectionName,
    getLevelBadge,
    handleOpenRoleDialog,
    handleDeleteRole,
    sortField,
    sortOrder,
    onSort,
}: RolesTableProps) {
    const { t } = useLanguage();

    const columns = [
        {
            id: 'name',
            header: t('roles_col_name'),
            sortable: true,
            render: (role: Role) => (
                <span className="font-medium">{role.name}</span>
            ),
        },
        {
            id: 'directionId',
            header: t('roles_col_direction'),
            sortable: true,
            render: (role: Role) => (
                <Badge variant="outline">{getDirectionName(role.directionId)}</Badge>
            ),
        },
        {
            id: 'level',
            header: t('roles_col_level'),
            sortable: true,
            render: (role: Role) => getLevelBadge(role.level),
        },
    ];

    const renderMobileCard = (role: Role) => (
        <Card className="overflow-hidden border-border bg-card hover:border-primary/50 transition-colors">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <div className="font-bold text-lg text-foreground leading-tight">
                            {role.name}
                        </div>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleOpenRoleDialog(role)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => handleDeleteRole(role.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4">
                <div className="grid grid-cols-1 gap-2 bg-muted/30 p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 text-sm">
                        <Layers className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground mr-1">{t('roles_col_direction')}:</span>
                        <Badge variant="outline" className="text-xs bg-background">
                            {getDirectionName(role.directionId)}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="text-muted-foreground mr-1">{t('roles_col_level')}:</span>
                        {getLevelBadge(role.level)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <GenericDataTable
            data={paginatedRoles}
            columns={columns}
            onEdit={handleOpenRoleDialog}
            onDelete={(role) => handleDeleteRole(role.id)}
            renderMobileCard={renderMobileCard}
            emptyMessage={t('roles_empty')}
            idField="id"
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={onSort}
        />
    );
}
