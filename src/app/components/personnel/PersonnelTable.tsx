import { Person } from '../../types/personnel';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent } from '../ui/card';
import { PersonnelMobileCard } from './PersonnelMobileCard';
import { PersonnelDesktopRow } from './PersonnelDesktopRow';

import { ColumnId, DEFAULT_COLUMNS } from './types';

interface PersonnelTableProps {
    personnel: Person[];
    visibleColumns: ColumnId[];
}

export function PersonnelTable({ personnel, visibleColumns }: PersonnelTableProps) {
    const { t } = useLanguage();

    const isVisible = (column: ColumnId) => visibleColumns.includes(column);

    return (
        <div className="space-y-4">
            {/* Mobile view - Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {personnel.length === 0 ? (
                    <Card className="bg-card">
                        <CardContent className="py-8 text-center text-muted-foreground">
                            {t('table_empty_state')}
                        </CardContent>
                    </Card>
                ) : (
                    personnel.map((person) => (
                        <PersonnelMobileCard key={person.id} person={person} />
                    ))
                )}
            </div>

            {/* Desktop view - Table */}
            <div className="hidden md:block border rounded-lg overflow-hidden bg-card overflow-x-auto">
                <Table className="min-w-[900px]">
                    <TableHeader>
                        <TableRow>
                            {isVisible('callsign') && <TableHead>{t('table_col_callsign')}</TableHead>}
                            {isVisible('fullname') && <TableHead>{t('table_col_fullname')}</TableHead>}
                            {isVisible('rank') && <TableHead>{t('table_col_rank')}</TableHead>}
                            {isVisible('unit') && <TableHead>{t('table_col_unit')}</TableHead>}
                            {isVisible('position') && <TableHead>{t('table_col_position')}</TableHead>}
                            {isVisible('roles') && <TableHead>{t('table_col_roles')}</TableHead>}
                            {isVisible('service_type') && <TableHead>{t('table_col_service_type')}</TableHead>}
                            {isVisible('status') && <TableHead>{t('table_col_status')}</TableHead>}
                            {isVisible('phone') && <TableHead>{t('table_col_phone')}</TableHead>}
                            <TableHead className="text-right">{t('common_actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {personnel.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={visibleColumns.length + 1} className="text-center py-8 text-muted-foreground">
                                    {t('table_empty_state')}
                                </TableCell>
                            </TableRow>
                        ) : (
                            personnel.map((person) => (
                                <PersonnelDesktopRow
                                    key={person.id}
                                    person={person}
                                    visibleColumns={visibleColumns}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
