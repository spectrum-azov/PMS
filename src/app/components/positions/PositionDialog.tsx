import React from 'react';
import { Position } from '../../types/personnel';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
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
    handleOpenDialog,
    handleSubmit,
}: PositionDialogProps) {
    const { t } = useLanguage();

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('positions_add')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {editingPosition ? t('positions_dialog_edit') : t('positions_dialog_add')}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="name">{t('positions_name')}</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder=""
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="category">{t('positions_category')}</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger>
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
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder=""
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            {t('common_cancel')}
                        </Button>
                        <Button type="submit">
                            {editingPosition ? t('common_update') : t('common_create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
