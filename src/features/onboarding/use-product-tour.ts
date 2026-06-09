'use client';

import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import {
    dashboardTourSteps,
    meetingsTourSteps,
    projectDetailTourSteps,
} from './tour-steps';

export function useProductTour() {
    const pathname = usePathname();

    const runTour = (steps: DriveStep[], onCompleteKey?: string) => {
        if (typeof window === 'undefined') return;

        // Filter steps to only include elements currently rendered in the DOM
        const activeSteps = steps.filter((step) => {
            if (typeof step.element === 'string') {
                return document.querySelector(step.element) !== null;
            }
            return true;
        });

        if (activeSteps.length === 0) {
            toast.info('No visible targets found to tour on this screen.');
            return;
        }

        const driverObj = driver({
            showProgress: true,
            animate: true,
            steps: activeSteps,
            onDestroyStarted: () => {
                if (onCompleteKey) {
                    localStorage.setItem(onCompleteKey, 'true');
                }
                driverObj.destroy();
            },
        });

        driverObj.drive();
    };

    const startDashboardTour = () => {
        runTour(dashboardTourSteps, 'snote.onboarding.dashboard.completed');
    };

    const startMeetingsTour = () => {
        runTour(meetingsTourSteps, 'snote.onboarding.meetings.completed');
    };

    const startProjectDetailTour = () => {
        runTour(
            projectDetailTourSteps,
            'snote.onboarding.project-detail.completed',
        );
    };

    const startCurrentPageTour = () => {
        if (pathname === '/dashboard') {
            startDashboardTour();
        } else if (pathname === '/meetings') {
            startMeetingsTour();
        } else if (pathname.match(/^\/meetings\/[a-zA-Z0-9-]+$/)) {
            startProjectDetailTour();
        } else {
            toast.info(
                'Quick tour is available on Dashboard, Projects, and Project Details.',
            );
        }
    };

    const resetTour = () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('snote.onboarding.dashboard.completed');
        localStorage.removeItem('snote.onboarding.dashboard.dismissed');
        localStorage.removeItem('snote.onboarding.meetings.completed');
        localStorage.removeItem('snote.onboarding.project-detail.completed');
        toast.success('Onboarding tours reset. Reloading your session...');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    return {
        startDashboardTour,
        startMeetingsTour,
        startProjectDetailTour,
        startCurrentPageTour,
        resetTour,
    };
}
