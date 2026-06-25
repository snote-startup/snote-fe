'use client';

import { useI18n } from './use-i18n';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

interface LanguageToggleProps {
    variant?: 'ghost' | 'outline' | 'default';
    size?: 'sm' | 'icon' | 'default';
    className?: string;
    /** Show the icon only (used in tight spaces) */
    iconOnly?: boolean;
}

export function LanguageToggle({
    variant = 'ghost',
    size = 'sm',
    className = '',
    iconOnly = false,
}: LanguageToggleProps) {
    const { language, toggleLanguage } = useI18n();

    return (
        <Button
            variant={variant}
            size={size}
            onClick={toggleLanguage}
            aria-label={
                language === 'vi'
                    ? 'Switch to English'
                    : 'Chuyển sang Tiếng Việt'
            }
            className={`shrink-0 ${className}`}
        >
            {iconOnly ? (
                <Languages className="h-4 w-4" />
            ) : (
                <>
                    <Languages className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">
                        {language === 'vi' ? 'EN' : 'VI'}
                    </span>
                </>
            )}
        </Button>
    );
}
