import React from 'react';
import { OrganizationalUnit } from '../../types/personnel';
import { useLanguage } from '../../context/LanguageContext';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { GenericDialog } from '../ui/GenericDialog';

interface UnitDialogProps {
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    editingUnit: OrganizationalUnit | null;
    units: OrganizationalUnit[];
    formData: Partial<OrganizationalUnit>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<OrganizationalUnit>>>;
    handleOpenDialog: (unit?: OrganizationalUnit) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function UnitDialog({
    isDialogOpen,
    setIsDialogOpen,
    editingUnit,
    units,
    formData,
    setFormData,
    handleSubmit,
}: UnitDialogProps) {
    const { t } = useLanguage();

    return (
        <GenericDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            title={editingUnit ? t('units_dialog_edit') : t('units_dialog_add')}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            triggerLabel={t('units_add')}
            saveLabel={editingUnit ? t('common_update') : t('common_create')}
        >
            <div className="space-y-4">
                <div>
                    <Label htmlFor="name">{t('units_name')}</Label>
                    <Input
                        id="name"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Група мереж та ІТ"
                        required
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="abbreviation">{t('units_abbreviation')}</Label>
                    <Input
                        id="abbreviation"
                        value={formData.abbreviation || ''}
                        onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                        placeholder="IT"
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="type">{t('units_type')}</Label>
                    <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value as OrganizationalUnit['type'] })}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Частина">{t('units_type_part')}</SelectItem>
                            <SelectItem value="Відділ">{t('units_type_dept')}</SelectItem>
                            <SelectItem value="Група">{t('units_type_group')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="location">{t('units_location')}</Label>
                    <Input
                        id="location"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Київ"
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="parentId">{t('units_parent')}</Label>
                    <Select
                        value={formData.parentId || 'none'}
                        onValueChange={(value) =>
                            setFormData({ ...formData, parentId: value === 'none' ? undefined : value })
                        }
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder={t('units_no_parent')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">{t('units_no_parent')}</SelectItem>
                            {units
                                .filter((u) => u.id !== editingUnit?.id)
                                .map((u) => (
                                    <SelectItem key={u.id} value={u.id}>
                                        {u.abbreviation} - {u.name}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </GenericDialog>
    );
}
