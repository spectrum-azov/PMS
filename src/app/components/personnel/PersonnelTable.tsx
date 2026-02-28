import { useNavigate } from 'react-router';
import { Person } from '../../types/personnel';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Eye, Edit, MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useLanguage } from '../../context/LanguageContext';
import { GenericDataTable } from '../ui/GenericDataTable';
import { PersonnelMobileCard } from './PersonnelMobileCard';
import { ColumnId } from './types';
import { usePersonnelFormatters } from '../../hooks/usePersonnelFormatters';
import { formatPhoneNumber } from '../../utils/formatters';

interface PersonnelTableProps {
    personnel: Person[];
    visibleColumns: ColumnId[];
}

export function PersonnelTable({ personnel, visibleColumns }: PersonnelTableProps) {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { getUnitName, getPositionName, getRoleName, getStatusBadge, getServiceTypeBadge } = usePersonnelFormatters();

    const isVisible = (column: ColumnId) => visibleColumns.includes(column);

    const columns = [
        {
            id: 'callsign',
            header: t('table_col_callsign'),
            render: (person: Person) => (
                <span className="font-mono font-medium text-primary">
                    {person.callsign}
                </span>
            ),
        },
        {
            id: 'fullname',
            header: t('table_col_fullname'),
            render: (person: Person) => (
                <div>
                    <div className="font-medium text-foreground">{person.fullName}</div>
                    {person.militaryId && (
                        <div className="text-xs text-muted-foreground">{person.militaryId}</div>
                    )}
                </div>
            ),
        },
        {
            id: 'rank',
            header: t('table_col_rank'),
            render: (person: Person) => <span className="text-sm">{person.rank}</span>,
        },
        {
            id: 'unit',
            header: t('table_col_unit'),
            render: (person: Person) => <span className="text-sm">{getUnitName(person.unitId)}</span>,
        },
        {
            id: 'position',
            header: t('table_col_position'),
            render: (person: Person) => <span className="text-sm">{getPositionName(person.positionId)}</span>,
        },
        {
            id: 'roles',
            header: t('table_col_roles'),
            render: (person: Person) => (
                <div className="flex flex-wrap gap-1">
                    {person.roleIds.slice(0, 2).map((roleId) => (
                        <Badge key={roleId} variant="outline" className="text-xs">
                            {getRoleName(roleId)}
                        </Badge>
                    ))}
                    {person.roleIds.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                            +{person.roleIds.length - 2}
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            id: 'service_type',
            header: t('table_col_service_type'),
            render: (person: Person) => getServiceTypeBadge(person.serviceType),
        },
        {
            id: 'status',
            header: t('table_col_status'),
            render: (person: Person) => getStatusBadge(person.status),
        },
        {
            id: 'phone',
            header: t('table_col_phone'),
            render: (person: Person) => (
                <span className="text-sm font-mono">{formatPhoneNumber(person.phone)}</span>
            ),
        },
    ].filter(col => isVisible(col.id as ColumnId));

    const renderActions = (person: Person) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/personnel/${person.id}`);
                }}>
                    <Eye className="w-4 h-4 mr-2" />
                    {t('table_action_view')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/personnel/${person.id}/edit`);
                }}>
                    <Edit className="w-4 h-4 mr-2" />
                    {t('table_action_edit')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <GenericDataTable
            data={personnel}
            columns={columns}
            onRowClick={(person) => navigate(`/personnel/${person.id}`)}
            renderMobileCard={(person) => <PersonnelMobileCard person={person} />}
            renderActions={renderActions}
            emptyMessage={t('table_no_results')}
            idField="id"
        />
    );
}
