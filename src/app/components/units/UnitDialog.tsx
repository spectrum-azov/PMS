import React from 'react';
import { OrganizationalUnit } from '../../types/personnel';
import { useLanguage } from '../../context/LanguageContext';
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
    handleOpenDialog,
    handleSubmit,
}: UnitDialogProps) {
    const { t } = useLanguage();

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('units_add')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {editingUnit ? t('units_dialog_edit') : t('units_dialog_add')}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="name">{t('units_name')}</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Група мереж та ІТ"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="abbreviation">{t('units_abbreviation')}</Label>
                            <Input
                                id="abbreviation"
                                value={formData.abbreviation}
                                onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                                placeholder="IT"
                            />
                        </div>

                        <div>
                            <Label htmlFor="type">{t('units_type')}</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger>
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
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Київ"
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
                                <SelectTrigger>
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
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            {t('common_cancel')}
                        </Button>
                        <Button type="submit">
                            {editingUnit ? t('common_update') : t('common_create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
