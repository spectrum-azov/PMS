import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Language, TranslationKey, translations } from '../i18n';

interface LanguageContextValue {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'pms-language';

function getInitialLang(): Language {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'en' ? 'en' : 'uk';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Language>(getInitialLang);

    const setLang = useCallback((newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem(STORAGE_KEY, newLang);
    }, []);

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    const t = useCallback(
        (key: TranslationKey): string => translations[lang][key] ?? key,
        [lang]
    );

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
    return ctx;
}
