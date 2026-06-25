'use client';

import { useRouter } from 'next/navigation';
import { CalendarDays, FolderOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/features/i18n/use-i18n';

export function Calendar() {
    const router = useRouter();
    const { t } = useI18n();

    return (
        <div className="mx-auto flex max-w-3xl flex-col items-center p-8 text-center">
            <div className="bg-muted mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
                <CalendarDays className="text-muted-foreground h-8 w-8" />
            </div>
            <h1 className="text-foreground mb-2 text-3xl font-semibold">
                {t('calendar.title')}
            </h1>
            <p className="text-muted-foreground mb-6 max-w-xl">
                {t('calendar.desc')}
            </p>
            <Button onClick={() => router.push('/meetings')}>
                <FolderOpen className="mr-2 h-4 w-4" />
                {t('calendar.openMeetings')}
            </Button>
        </div>
    );
}
