
import { Role } from '../../types/personnel';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { useLanguage } from '../../context/LanguageContext';
import { GenericDialog } from '../ui/GenericDialog';

interface RoleDialogProps {
    onSave: (roleFormData: Partial<Role>) => Promise<void>;
    editingRole: Role | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    roleFormData: Partial<Role>;
    setRoleFormData: (data: Partial<Role>) => void;
    directions: { id: string, name: string }[];
}

export function RoleDialog({
    onSave,
    editingRole,
    isOpen,
    setIsOpen,
    roleFormData,
    setRoleFormData,
    directions
}: RoleDialogProps) {
    const { t } = useLanguage();

    return (
        <GenericDialog
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            title={editingRole ? t('roles_dialog_edit_role') : t('roles_dialog_add_role')}
            onSubmit={(e) => { e.preventDefault(); onSave(roleFormData); }}
            onCancel={() => setIsOpen(false)}
            triggerLabel={t('roles_add_role')}
            saveLabel={editingRole ? t('common_update') : t('common_create')}
        >
            <div className="space-y-4">
                <div>
                    <Label htmlFor="roleName">{t('roles_role_name')}</Label>
                    <Input
                        id="roleName"
                        value={roleFormData.name || ''}
                        onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                        placeholder=""
                        required
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="directionId">{t('roles_functional_direction')}</Label>
                    <Select
                        value={roleFormData.directionId}
                        onValueChange={(value) => setRoleFormData({ ...roleFormData, directionId: value })}
                    >
                        <SelectTrigger className="mt-1">
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
                        <SelectTrigger className="mt-1">
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
        </GenericDialog>
    );
}
