'use client';

import { FolderOpen, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface AppEmptyStateProps {
    title: string;
    description: string;
    icon?: LucideIcon;
    action?: {
        label: string;
        onClick: () => void;
    };
    children?: ReactNode;
}

export function AppEmptyState({
    title,
    description,
    icon: Icon = FolderOpen,
    action,
    children,
}: AppEmptyStateProps) {
    return (
        <div className="border-border bg-card/50 animate-fade-in mx-auto flex w-full max-w-2xl flex-col items-center justify-center rounded-2xl border p-12 text-center shadow-sm backdrop-blur-sm">
            {/* Ambient icon container */}
            <div className="bg-muted border-border/40 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border shadow-inner">
                <Icon className="text-muted-foreground h-8 w-8 animate-pulse" />
            </div>

            {/* Typography */}
            <h3 className="text-foreground mb-2 text-xl font-semibold tracking-tight">
                {title}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-sm text-sm leading-relaxed">
                {description}
            </p>

            {/* Custom or default actions */}
            {action && (
                <Button
                    onClick={action.onClick}
                    variant="default"
                    size="lg"
                    className="shadow-sm"
                >
                    {action.label}
                </Button>
            )}

            {children}
        </div>
    );
}
