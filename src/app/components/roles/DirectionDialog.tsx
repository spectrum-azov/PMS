
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useLanguage } from '../../context/LanguageContext';
import { GenericDialog } from '../ui/GenericDialog';

interface DirectionDialogProps {
    onSave: (directionFormData: { name: string }) => Promise<void>;
    editingDirection: { id: string; name: string } | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    directionFormData: { name: string };
    setDirectionFormData: (data: { name: string }) => void;
}

export function DirectionDialog({
    onSave,
    editingDirection,
    isOpen,
    setIsOpen,
    directionFormData,
    setDirectionFormData
}: DirectionDialogProps) {
    const { t } = useLanguage();

    return (
        <GenericDialog
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            title={editingDirection ? t('roles_dialog_edit_direction') : t('roles_dialog_add_direction')}
            onSubmit={(e) => { e.preventDefault(); onSave(directionFormData); }}
            onCancel={() => setIsOpen(false)}
            triggerLabel={t('roles_add_direction')}
            saveLabel={editingDirection ? t('common_update') : t('common_create')}
        >
            <div>
                <Label htmlFor="directionName" className="mb-2">{t('roles_direction_name')}</Label>
                <Input
                    id="directionName"
                    value={directionFormData.name}
                    onChange={(e) => setDirectionFormData({ name: e.target.value })}
                    placeholder=""
                    required
                />
            </div>
        </GenericDialog>
    );
}
