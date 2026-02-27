import { useState } from 'react';
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
import { Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface DirectionDialogProps {
    onSave: (directionFormData: { name: string }) => Promise<void>;
    editingDirection: { id: string; name: string } | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    directionFormData: { name: string };
    setDirectionFormData: (data: { name: string }) => void;
    handleOpenDialog: () => void;
}

export function DirectionDialog({
    onSave,
    editingDirection,
    isOpen,
    setIsOpen,
    directionFormData,
    setDirectionFormData,
    handleOpenDialog
}: DirectionDialogProps) {
    const { t } = useLanguage();

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" onClick={handleOpenDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('roles_add_direction')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {editingDirection ? t('roles_dialog_edit_direction') : t('roles_dialog_add_direction')}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); onSave(directionFormData); }}>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="directionName">{t('roles_direction_name')}</Label>
                            <Input
                                id="directionName"
                                value={directionFormData.name}
                                onChange={(e) => setDirectionFormData({ name: e.target.value })}
                                placeholder=""
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            {t('common_cancel')}
                        </Button>
                        <Button type="submit">
                            {editingDirection ? t('common_update') : t('common_create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
