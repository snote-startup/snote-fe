'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ListTodo, ArrowRight } from 'lucide-react';

export function TaskBoard() {
    const router = useRouter();

    return (
        <div className="animate-fade-in-up flex h-full flex-col items-center justify-center p-6">
            <div className="border-border bg-card flex max-w-md flex-col items-center rounded-xl border p-8 text-center shadow-sm">
                <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <ListTodo className="text-primary h-8 w-8" />
                </div>
                <h2 className="text-foreground mb-2 text-xl font-semibold tracking-tight">
                    Project-Scoped Tasks
                </h2>
                <p className="text-muted-foreground mb-6 text-sm">
                    Tasks are currently strictly scoped to individual projects.
                    You can generate, view, and manage action items directly
                    from the transcript inside your project details.
                </p>
                <Button
                    onClick={() => router.push('/meetings')}
                    size="lg"
                    className="w-full"
                >
                    Go to Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
