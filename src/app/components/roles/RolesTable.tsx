import React from 'react';
import { Role } from '../../types/personnel';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import { useLanguage } from '../../context/LanguageContext';

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

    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('roles_col_name')}</TableHead>
                        <TableHead>{t('roles_col_direction')}</TableHead>
                        <TableHead>{t('roles_col_level')}</TableHead>
                        <TableHead className="text-right">{t('common_actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                {t('roles_empty')}
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedRoles.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell>
                                    <span className="font-medium">{role.name}</span>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{getDirectionName(role.directionId)}</Badge>
                                </TableCell>
                                <TableCell>{getLevelBadge(role.level)}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleOpenRoleDialog(role)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteRole(role.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
