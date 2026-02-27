import { useNavigate } from 'react-router';
import { Person } from '../../types/personnel';
import { formatPhoneNumber } from '../../utils/formatters';
import { TableRow, TableCell } from '../ui/table';
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
import { ColumnId } from './types';
import { usePersonnelFormatters } from '../../hooks/usePersonnelFormatters';

interface PersonnelDesktopRowProps {
    person: Person;
    visibleColumns: ColumnId[];
}

export function PersonnelDesktopRow({ person, visibleColumns }: PersonnelDesktopRowProps) {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { getUnitName, getPositionName, getRoleName, getStatusBadge, getServiceTypeBadge } = usePersonnelFormatters();

    const isVisible = (column: ColumnId) => visibleColumns.includes(column);

    return (
        <TableRow
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => navigate(`/personnel/${person.id}`)}
        >
            {isVisible('callsign') && (
                <TableCell>
                    <span className="font-mono font-medium text-primary">
                        {person.callsign}
                    </span>
                </TableCell>
            )}
            {isVisible('fullname') && (
                <TableCell>
                    <div>
                        <div className="font-medium text-foreground">{person.fullName}</div>
                        {person.militaryId && (
                            <div className="text-xs text-muted-foreground">{person.militaryId}</div>
                        )}
                    </div>
                </TableCell>
            )}
            {isVisible('rank') && (
                <TableCell>
                    <span className="text-sm">{person.rank}</span>
                </TableCell>
            )}
            {isVisible('unit') && (
                <TableCell>
                    <span className="text-sm">{getUnitName(person.unitId)}</span>
                </TableCell>
            )}
            {isVisible('position') && (
                <TableCell>
                    <span className="text-sm">{getPositionName(person.positionId)}</span>
                </TableCell>
            )}
            {isVisible('roles') && (
                <TableCell>
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
                </TableCell>
            )}
            {isVisible('service_type') && (
                <TableCell>{getServiceTypeBadge(person.serviceType)}</TableCell>
            )}
            {isVisible('status') && (
                <TableCell>{getStatusBadge(person.status)}</TableCell>
            )}
            {isVisible('phone') && (
                <TableCell>
                    <span className="text-sm font-mono">{formatPhoneNumber(person.phone)}</span>
                </TableCell>
            )}
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/personnel/${person.id}`);
                            }}
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            {t('table_action_view')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/personnel/${person.id}/edit`);
                            }}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            {t('table_action_edit')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
