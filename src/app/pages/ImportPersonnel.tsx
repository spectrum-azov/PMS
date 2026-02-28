import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { useImportPersonnel } from '../hooks/useImportPersonnel';
import { ImportPersonnelTable } from '../components/import-personnel/ImportPersonnelTable';

import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Upload, ChevronLeft, Check, Save, Loader2, Database } from 'lucide-react';

export default function ImportPersonnel() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const {
        data,
        isImporting,
        isChecking,
        dbChecked,
        fileInputRef,
        handleFileUpload,
        updateRowField,
        toggleRowSelection,
        toggleAll,
        handleCheckDb,
        handleImport
    } = useImportPersonnel();

    const selectedCount = data.filter(d => d._selected).length;
    const validSelectedCount = data.filter(d => d._selected && d._isValid).length;

    return (
        <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/personnel')}>
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-3xl font-semibold text-foreground">{t('import_title')}</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('import_upload_title')}</CardTitle>
                    <CardDescription>{t('import_upload_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <input
                            type="file"
                            accept=".csv"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => handleFileUpload(e.target.files?.[0])}
                        />
                        <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                            <Upload className="w-4 h-4 mr-2" /> {t('import_select_file')}
                        </Button>

                        {data.length > 0 && (
                            <>
                                <Button
                                    onClick={handleCheckDb}
                                    disabled={isChecking || dbChecked}
                                    variant={dbChecked ? 'secondary' : 'outline'}
                                >
                                    {isChecking ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : dbChecked ? (
                                        <Check className="w-4 h-4 mr-2" />
                                    ) : (
                                        <Database className="w-4 h-4 mr-2" />
                                    )}
                                    {isChecking ? t('import_checking_db') : dbChecked ? t('import_db_checked') : t('import_check_db')}
                                </Button>
                                <Button onClick={handleImport} disabled={validSelectedCount === 0 || isImporting || !dbChecked} className="ml-auto">
                                    <Save className="w-4 h-4 mr-2" /> {t('import_btn')} ({validSelectedCount} {t('import_valid')})
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {data.length > 0 && (
                <ImportPersonnelTable
                    data={data}
                    selectedCount={selectedCount}
                    toggleAll={toggleAll}
                    toggleRowSelection={toggleRowSelection}
                    updateRowField={updateRowField}
                />
            )}
        </div>
    );
}
