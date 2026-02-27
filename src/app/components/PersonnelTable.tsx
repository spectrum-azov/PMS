import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Person } from '../types/personnel';
import { useDictionaries } from '../context/DictionariesContext';
import { formatPhoneNumber } from '../utils/formatters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardAction } from './ui/card';
import { Eye, Edit, MoreVertical, Phone, User, Shield, Settings2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';

interface PersonnelTableProps {
  personnel: Person[];
}

type ColumnId = 'callsign' | 'fullname' | 'rank' | 'unit' | 'position' | 'roles' | 'service_type' | 'status' | 'phone';

const STORAGE_KEY = 'personnel-table-columns';
const DEFAULT_COLUMNS: ColumnId[] = ['callsign', 'fullname', 'rank', 'unit', 'position', 'roles', 'service_type', 'status', 'phone'];

export function PersonnelTable({ personnel }: PersonnelTableProps) {
  const navigate = useNavigate();
  const { units, positions, roles } = useDictionaries();
  const { t } = useLanguage();

  const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_COLUMNS;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_COLUMNS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const toggleColumn = (column: ColumnId) => {
    setVisibleColumns(prev =>
      prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const getUnitName = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    return unit?.name || t('common_unknown');
  };

  const getPositionName = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    return position?.name || t('common_unknown');
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.name || t('common_unknown');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'Служить': 'default',
      'Переведений': 'secondary',
      'Звільнений': 'destructive',
    };
    const translatedStatus = (() => {
      if (status === 'Служить') return t('filters_status_serving');
      if (status === 'Переведений') return t('filters_status_transferred');
      if (status === 'Звільнений') return t('filters_status_dismissed');
      return status;
    })();
    return <Badge variant={variants[status] || 'outline'}>{translatedStatus}</Badge>;
  };

  const getServiceTypeBadge = (type: string) => {
    const translatedType = (() => {
      if (type === 'Контракт') return t('filters_service_contract');
      if (type === 'Мобілізований') return t('filters_service_mobilized');
      return type;
    })();
    return (
      <Badge variant={type === 'Контракт' ? 'default' : 'secondary'}>
        {translatedType}
      </Badge>
    );
  };

  const isVisible = (column: ColumnId) => visibleColumns.includes(column);

  const columnOptions: { id: ColumnId; label: string }[] = [
    { id: 'callsign', label: t('table_col_callsign') },
    { id: 'fullname', label: t('table_col_fullname') },
    { id: 'rank', label: t('table_col_rank') },
    { id: 'unit', label: t('table_col_unit') },
    { id: 'position', label: t('table_col_position') },
    { id: 'roles', label: t('table_col_roles') },
    { id: 'service_type', label: t('table_col_service_type') },
    { id: 'status', label: t('table_col_status') },
    { id: 'phone', label: t('table_col_phone') },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings2 className="w-4 h-4" />
              {t('table_columns')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t('table_columns_settings')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columnOptions.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={isVisible(column.id)}
                onCheckedChange={() => toggleColumn(column.id)}
                onSelect={(e) => e.preventDefault()}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
            <Card
              key={person.id}
              className="cursor-pointer hover:border-primary transition-colors bg-card overflow-hidden"
              onClick={() => navigate(`/personnel/${person.id}`)}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="font-mono font-bold text-lg text-primary">
                        {person.callsign}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium mt-0.5 uppercase tracking-wider">
                      {person.rank}
                    </div>
                  </div>
                  <CardAction>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
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
                  </CardAction>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-foreground font-semibold mb-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    {person.fullName}
                  </div>
                  {person.militaryId && (
                    <div className="text-xs text-muted-foreground ml-6">
                      ID: {person.militaryId}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2 bg-muted/50 p-3 rounded-lg border border-border">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{t('table_col_unit')}</span>
                    <span className="font-medium text-foreground">{getUnitName(person.unitId)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{t('table_col_position')}</span>
                    <span className="font-medium text-foreground text-right">{getPositionName(person.positionId)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {getServiceTypeBadge(person.serviceType)}
                  {getStatusBadge(person.status)}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-3 border-t border-border">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono">{formatPhoneNumber(person.phone)}</span>
                </div>
              </CardContent>
            </Card>
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
                <TableCell colSpan={columnOptions.filter(o => isVisible(o.id)).length + 1} className="text-center py-8 text-muted-foreground">
                  {t('table_empty_state')}
                </TableCell>
              </TableRow>
            ) : (
              personnel.map((person) => (
                <TableRow
                  key={person.id}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}