import React from 'react';
import { OrganizationalUnit } from '../../types/personnel';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Edit, Trash2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';

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

    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('units_col_abbrev')}</TableHead>
                        <TableHead>{t('units_col_name')}</TableHead>
                        <TableHead>{t('units_col_type')}</TableHead>
                        <TableHead>{t('units_col_parent')}</TableHead>
                        <TableHead>{t('units_col_location')}</TableHead>
                        <TableHead className="text-right">{t('common_actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {units.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                {t('units_empty')}
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedUnits.map((unit) => (
                            <TableRow key={unit.id}>
                                <TableCell>
                                    <span className="font-medium text-blue-600 font-mono">
                                        {unit.abbreviation || '—'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="font-medium">{unit.name}</span>
                                </TableCell>
                                <TableCell>{getTypeBadge(unit.type)}</TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                        {getParentName(unit.parentId)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">{unit.location || '—'}</span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleOpenDialog(unit)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(unit.id)}
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
