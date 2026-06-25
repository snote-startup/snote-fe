import { create } from 'zustand';

export type AppLanguage = 'vi' | 'en';

const STORAGE_KEY = 'snote.language';
const DEFAULT_LANGUAGE: AppLanguage = 'vi';

function getStoredLanguage(): AppLanguage {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'en' || stored === 'vi') return stored;
    } catch {
        // localStorage blocked
    }
    return DEFAULT_LANGUAGE;
}

function persistLanguage(language: AppLanguage) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, language);
    } catch {
        // localStorage blocked
    }
}

interface I18nState {
    language: AppLanguage;
    setLanguage: (language: AppLanguage) => void;
    toggleLanguage: () => void;
}

export const useI18nStore = create<I18nState>((set, get) => ({
    language: DEFAULT_LANGUAGE,
    setLanguage: (language) => {
        persistLanguage(language);
        set({ language });
    },
    toggleLanguage: () => {
        const next = get().language === 'vi' ? 'en' : 'vi';
        persistLanguage(next);
        set({ language: next });
    },
}));

/**
 * Hydrate the store from localStorage on the client.
 * Call this once in a top-level client component (e.g. Providers).
 */
export function hydrateI18nStore() {
    const stored = getStoredLanguage();
    if (stored !== useI18nStore.getState().language) {
        useI18nStore.setState({ language: stored });
    }
}
