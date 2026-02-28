import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from './button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from './dialog';
import { Plus } from 'lucide-react';

interface GenericDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    children: React.ReactNode;
    triggerLabel?: string;
    saveLabel?: string;
    cancelLabel?: string;
    triggerIcon?: React.ReactNode;
}

export function GenericDialog({
    isOpen,
    onOpenChange,
    title,
    onSubmit,
    onCancel,
    children,
    triggerLabel,
    saveLabel,
    cancelLabel,
    triggerIcon = <Plus className="w-4 h-4 mr-2" />,
}: GenericDialogProps) {
    const { t } = useLanguage();

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {triggerLabel && (
                <DialogTrigger asChild>
                    <Button>
                        {triggerIcon}
                        {triggerLabel}
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">{title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="space-y-5 py-4">
                        {children}
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            {cancelLabel || t('common_cancel')}
                        </Button>
                        <Button type="submit">
                            {saveLabel || t('common_save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
