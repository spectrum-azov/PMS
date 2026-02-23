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
import { Eye, Edit, MoreVertical } from 'lucide-react';
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

  const getUnitName = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    return unit?.name || 'Невідомо';
  };

  const getPositionName = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    return position?.name || 'Невідомо';
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.name || 'Невідомо';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'Служить': 'default',
      'Переведений': 'secondary',
      'Звільнений': 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getServiceTypeBadge = (type: string) => {
    return (
      <Badge variant={type === 'Контракт' ? 'default' : 'secondary'}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white overflow-x-auto">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow>
            <TableHead>Позивний</TableHead>
            <TableHead>ПІБ</TableHead>
            <TableHead>Звання</TableHead>
            <TableHead>Підрозділ</TableHead>
            <TableHead>Посада</TableHead>
            <TableHead>Ролі</TableHead>
            <TableHead>Вид служби</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead className="text-right">Дії</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personnel.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                Не знайдено жодної особи за вказаними критеріями
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
                        Переглянути
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/personnel/${person.id}/edit`);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Редагувати
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
  );
}