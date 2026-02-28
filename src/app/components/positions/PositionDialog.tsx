import React from 'react';
import { Position } from '../../types/personnel';
import { useLanguage } from '../../context/LanguageContext';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { GenericDialog } from '../ui/GenericDialog';

interface PositionDialogProps {
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    editingPosition: Position | null;
    formData: Partial<Position>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<Position>>>;
    handleOpenDialog: (position?: Position) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function PositionDialog({
    isDialogOpen,
    setIsDialogOpen,
    editingPosition,
    formData,
    setFormData,
    handleSubmit,
}: PositionDialogProps) {
    const { t } = useLanguage();

    return (
        <GenericDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            title={editingPosition ? t('positions_dialog_edit') : t('positions_dialog_add')}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            triggerLabel={t('positions_add')}
            saveLabel={editingPosition ? t('common_update') : t('common_create')}
        >
            <div className="space-y-4">
                <div>
                    <Label htmlFor="name">{t('positions_name')}</Label>
                    <Input
                        id="name"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder=""
                        required
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="category">{t('positions_category')}</Label>
                    <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value as Position['category'] })}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="positions_cat_commander">{t('positions_cat_commander')}</SelectItem>
                            <SelectItem value="positions_cat_sergeant">{t('positions_cat_sergeant')}</SelectItem>
                            <SelectItem value="positions_cat_soldier">{t('positions_cat_soldier')}</SelectItem>
                            <SelectItem value="positions_cat_civilian">{t('positions_cat_civilian')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="description">{t('positions_description')}</Label>
                    <Textarea
                        id="description"
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder=""
                        rows={3}
                        className="mt-1"
                    />
                </div>
            </div>
        </GenericDialog>
    );
}
