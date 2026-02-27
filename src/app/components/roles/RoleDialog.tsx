import { Role } from '../../types/personnel';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '../ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface RoleDialogProps {
    onSave: (roleFormData: Partial<Role>) => Promise<void>;
    editingRole: Role | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    roleFormData: Partial<Role>;
    setRoleFormData: (data: Partial<Role>) => void;
    handleOpenDialog: () => void;
    directions: { id: string, name: string }[];
}

export function RoleDialog({
    onSave,
    editingRole,
    isOpen,
    setIsOpen,
    roleFormData,
    setRoleFormData,
    handleOpenDialog,
    directions
}: RoleDialogProps) {
    const { t } = useLanguage();

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button onClick={handleOpenDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('roles_add_role')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {editingRole ? t('roles_dialog_edit_role') : t('roles_dialog_add_role')}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); onSave(roleFormData); }}>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="roleName">{t('roles_role_name')}</Label>
                            <Input
                                id="roleName"
                                value={roleFormData.name}
                                onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                                placeholder=""
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="directionId">{t('roles_functional_direction')}</Label>
                            <Select
                                value={roleFormData.directionId}
                                onValueChange={(value) => setRoleFormData({ ...roleFormData, directionId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('roles_select_direction')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {directions.map((direction) => (
                                        <SelectItem key={direction.id} value={direction.id}>
                                            {direction.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="level">{t('roles_expertise_level')}</Label>
                            <Select
                                value={roleFormData.level?.toString()}
                                onValueChange={(value) => setRoleFormData({ ...roleFormData, level: parseInt(value) as 1 | 2 | 3 })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 - {t('roles_level_beginner')}</SelectItem>
                                    <SelectItem value="2">2 - {t('roles_level_experienced')}</SelectItem>
                                    <SelectItem value="3">3 - {t('roles_level_expert')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            {t('common_cancel')}
                        </Button>
                        <Button type="submit">
                            {editingRole ? t('common_update') : t('common_create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
