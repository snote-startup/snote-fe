'use client';

import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp } from 'lucide-react';

interface UpgradeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reason?: 'minutes-exceeded' | 'trial-expired' | 'feature-locked';
}

export function UpgradeModal({
    open,
    onOpenChange,
    reason = 'minutes-exceeded',
}: UpgradeModalProps) {
    const router = useRouter();

    const content = {
        'minutes-exceeded': {
            title: 'Meeting Minutes Exceeded',
            description:
                "You've used all your meeting minutes for this period. Upgrade to continue recording meetings.",
            icon: <Sparkles className="h-6 w-6 text-blue-600" />,
        },
        'trial-expired': {
            title: 'Free Trial Expired',
            description:
                'Your 7-day free trial has ended. Upgrade to Pro to continue using all premium features.',
            icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
        },
        'feature-locked': {
            title: 'Premium Feature',
            description:
                'This feature is only available on Pro and Enterprise plans. Upgrade to unlock it.',
            icon: <Sparkles className="h-6 w-6 text-blue-600" />,
        },
    };

    const { title, description, icon } = content[reason];

    const handleUpgrade = () => {
        onOpenChange(false);
        router.push('/pricing');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        {icon}
                    </div>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="my-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="mb-2 text-sm font-medium text-blue-900">
                        Upgrade to Pro and get:
                    </p>
                    <ul className="space-y-1 text-sm text-blue-800">
                        <li>✓ 500 meeting minutes per month</li>
                        <li>✓ Unlimited transcriptions</li>
                        <li>✓ AI-powered insights & summaries</li>
                        <li>✓ Priority support</li>
                    </ul>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Maybe Later
                    </Button>
                    <Button onClick={handleUpgrade}>Upgrade to Pro</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
