import { useNavigate } from 'react-router';
import { Person } from '../types/personnel';
import { formatPhoneNumber } from '../utils/formatters';
import { Card, CardContent, CardHeader, CardAction } from './ui/card';
import { Eye, Edit, MoreVertical, Phone, User, Shield } from 'lucide-react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useLanguage } from '../context/LanguageContext';
import { usePersonnelFormatters } from '../hooks/usePersonnelFormatters';

interface PersonnelMobileCardProps {
    person: Person;
}

export function PersonnelMobileCard({ person }: PersonnelMobileCardProps) {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { getUnitName, getPositionName, getStatusBadge, getServiceTypeBadge } = usePersonnelFormatters();

    return (
        <Card
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
    );
}
