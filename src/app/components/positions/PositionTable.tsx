import React from 'react';
import { Position } from '../../types/personnel';
import { useLanguage } from '../../context/LanguageContext';
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

    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('positions_col_name')}</TableHead>
                        <TableHead>{t('positions_col_category')}</TableHead>
                        <TableHead>{t('positions_col_description')}</TableHead>
                        <TableHead className="text-right">{t('common_actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {positions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                {t('positions_empty')}
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedPositions.map((position) => (
                            <TableRow key={position.id}>
                                <TableCell>
                                    <span className="font-medium">{position.name}</span>
                                </TableCell>
                                <TableCell>{getCategoryBadge(position.category)}</TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                        {position.description || '—'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleOpenDialog(position)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(position.id)}
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
