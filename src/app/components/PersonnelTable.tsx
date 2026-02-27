import { useNavigate } from 'react-router';
import { Person } from '../types/personnel';
import { useDictionaries } from '../context/DictionariesContext';
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
import { Eye, Edit, MoreVertical, Phone, User, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface PersonnelTableProps {
  personnel: Person[];
}

export function PersonnelTable({ personnel }: PersonnelTableProps) {
  const navigate = useNavigate();
  const { units, positions, roles } = useDictionaries();
  const { t } = useLanguage();

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

  return (
    <div className="space-y-4">
      {/* Mobile view - Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {personnel.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="py-8 text-center text-gray-500">
              {t('table_empty_state')}
            </CardContent>
          </Card>
        ) : (
          personnel.map((person) => (
            <Card
              key={person.id}
              className="cursor-pointer hover:border-blue-400 transition-colors bg-white overflow-hidden"
              onClick={() => navigate(`/personnel/${person.id}`)}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="font-mono font-bold text-lg text-blue-600">
                        {person.callsign}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5 uppercase tracking-wider">
                      {person.rank}
                    </div>
                  </div>
                  <CardAction>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4 text-gray-500" />
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
                  <div className="flex items-center gap-2 text-gray-900 font-semibold mb-1">
                    <User className="w-4 h-4 text-gray-400" />
                    {person.fullName}
                  </div>
                  {person.militaryId && (
                    <div className="text-xs text-gray-500 ml-6">
                      ID: {person.militaryId}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{t('table_col_unit')}</span>
                    <span className="font-medium text-gray-900">{getUnitName(person.unitId)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{t('table_col_position')}</span>
                    <span className="font-medium text-gray-900 text-right">{getPositionName(person.positionId)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {getServiceTypeBadge(person.serviceType)}
                  {getStatusBadge(person.status)}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 pt-3 border-t border-gray-100">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="font-mono">{person.phone}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Desktop view - Table */}
      <div className="hidden md:block border rounded-lg overflow-hidden bg-white overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead>{t('table_col_callsign')}</TableHead>
              <TableHead>{t('table_col_fullname')}</TableHead>
              <TableHead>{t('table_col_rank')}</TableHead>
              <TableHead>{t('table_col_unit')}</TableHead>
              <TableHead>{t('table_col_position')}</TableHead>
              <TableHead>{t('table_col_roles')}</TableHead>
              <TableHead>{t('table_col_service_type')}</TableHead>
              <TableHead>{t('table_col_status')}</TableHead>
              <TableHead>{t('table_col_phone')}</TableHead>
              <TableHead className="text-right">{t('common_actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {personnel.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  {t('table_empty_state')}
                </TableCell>
              </TableRow>
            ) : (
              personnel.map((person) => (
                <TableRow
                  key={person.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/personnel/${person.id}`)}
                >
                  <TableCell>
                    <span className="font-mono font-medium text-blue-600">
                      {person.callsign}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{person.fullName}</div>
                      {person.militaryId && (
                        <div className="text-xs text-gray-500">{person.militaryId}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{person.rank}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{getUnitName(person.unitId)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{getPositionName(person.positionId)}</span>
                  </TableCell>
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
                  <TableCell>{getServiceTypeBadge(person.serviceType)}</TableCell>
                  <TableCell>{getStatusBadge(person.status)}</TableCell>
                  <TableCell>
                    <span className="text-sm font-mono">{person.phone}</span>
                  </TableCell>
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