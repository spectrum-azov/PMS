import React from 'react';
import { Role } from '../../types/personnel';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../context/LanguageContext';
import { GenericDataTable } from '../ui/GenericDataTable';

interface RolesTableProps {
    roles: Role[];
    paginatedRoles: Role[];
    getDirectionName: (id: string) => string;
    getLevelBadge: (level?: number) => React.ReactNode;
    handleOpenRoleDialog: (role: Role) => void;
    handleDeleteRole: (id: string) => void;
}

export function RolesTable({
    roles,
    paginatedRoles,
    getDirectionName,
    getLevelBadge,
    handleOpenRoleDialog,
    handleDeleteRole
}: RolesTableProps) {
    const { t } = useLanguage();

    const columns = [
        {
            header: t('roles_col_name'),
            render: (role: Role) => (
                <span className="font-medium">{role.name}</span>
            ),
        },
        {
            header: t('roles_col_direction'),
            render: (role: Role) => (
                <Badge variant="outline">{getDirectionName(role.directionId)}</Badge>
            ),
        },
        {
            header: t('roles_col_level'),
            render: (role: Role) => getLevelBadge(role.level),
        },
    ];

    return (
        <GenericDataTable
            data={paginatedRoles}
            columns={columns}
            onEdit={handleOpenRoleDialog}
            onDelete={(role) => handleDeleteRole(role.id)}
            emptyMessage={t('roles_empty')}
            idField="id"
        />
    );
}
