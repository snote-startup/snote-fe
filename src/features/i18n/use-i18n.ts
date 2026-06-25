'use client';

import { useEffect } from 'react';
import { useI18nStore, hydrateI18nStore } from './i18n-store';
import { dictionaries, type TranslationKey } from './dictionaries';
import type { AppLanguage } from './i18n-store';

/**
 * Lightweight i18n hook.
 *
 * ```tsx
 * const { t, language, toggleLanguage } = useI18n();
 * <h1>{t('hero.title.line1')}</h1>
 * ```
 */
export function useI18n() {
    const language = useI18nStore((s) => s.language);
    const setLanguage = useI18nStore((s) => s.setLanguage);
    const toggleLanguage = useI18nStore((s) => s.toggleLanguage);

    // Hydrate from localStorage once on mount
    useEffect(() => {
        hydrateI18nStore();
    }, []);

    function t(key: TranslationKey): string {
        const entry = dictionaries[key];
        if (!entry) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn(`[i18n] Missing key: ${key}`);
            }
            return key;
        }
        return entry[language] ?? entry['vi'] ?? key;
    }

    return { language, setLanguage, toggleLanguage, t };
}

export type { AppLanguage, TranslationKey };
