'use client';

import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import {
    type CalendarEvent,
    type Meeting,
    type Task,
    type User,
    mockCalendarEvents,
    mockMeetings,
    mockTasks,
    mockUser,
} from '@/lib/snote/mock-data';
import { useAuthStore } from '@/stores/use-auth-store';
import type { MinimalAccount } from '@/lib/api/auth-api';

type UserRole = 'admin' | 'user' | null;
export type MockAuthRole = 'free' | 'pro' | 'admin';

type RoleProfile = {
    role: MockAuthRole;
    label: string;
    description: string;
    badge: string;
    badgeTone: 'standard' | 'pro' | 'admin';
    isAdmin: boolean;
    isPro: boolean;
    hasUnlimitedMinutes: boolean;
    meetingLimit: number | null;
    meetingsUsed: number;
    insightLevel: 'standard' | 'advanced' | 'global';
};

const roleProfiles: Record<MockAuthRole, RoleProfile> = {
    free: {
        role: 'free',
        label: 'Free User',
        description: 'Limited minutes and standard insights',
        badge: 'Free',
        badgeTone: 'standard',
        isAdmin: false,
        isPro: false,
        hasUnlimitedMinutes: false,
        meetingLimit: 5,
        meetingsUsed: 3,
        insightLevel: 'standard',
    },
    pro: {
        role: 'pro',
        label: 'Pro User',
        description: 'Unlimited usage and advanced insights',
        badge: 'PRO',
        badgeTone: 'pro',
        isAdmin: false,
        isPro: true,
        hasUnlimitedMinutes: true,
        meetingLimit: null,
        meetingsUsed: 18,
        insightLevel: 'advanced',
    },
    admin: {
        role: 'admin',
        label: 'Admin',
        description: 'Global access and command controls',
        badge: 'Admin',
        badgeTone: 'admin',
        isAdmin: true,
        isPro: true,
        hasUnlimitedMinutes: true,
        meetingLimit: null,
        meetingsUsed: 128,
        insightLevel: 'global',
    },
};

interface AppContextType {
    account: MinimalAccount | null;
    user: User | null;
    setUser: (user: User | null) => void;
    userRole: UserRole;
    setUserRole: (role: UserRole) => void;
    authRole: MockAuthRole;
    setAuthRole: (role: MockAuthRole) => void;
    roleProfile: RoleProfile;
    roleProfiles: Record<MockAuthRole, RoleProfile>;
    isAdmin: boolean;
    isPro: boolean;
    isFree: boolean;
    meetings: Meeting[];
    setMeetings: (meetings: Meeting[]) => void;
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    calendarEvents: CalendarEvent[];
    setCalendarEvents: (events: CalendarEvent[]) => void;
    activeMeeting: {
        isActive: boolean;
        meetingId?: string;
        startTime?: Date;
        transcript: unknown[];
        insights: unknown[];
    };
    setActiveMeeting: (meeting: AppContextType['activeMeeting']) => void;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    signup: (email: string, password: string, name: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const authUser = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const authLogin = useAuthStore((state) => state.login);
    const authRegister = useAuthStore((state) => state.register);
    const authLogout = useAuthStore((state) => state.logout);
    const [authRole, setAuthRoleState] = useState<MockAuthRole>('free');
    const [userOverride, setUserOverride] = useState<User | null>(null);
    const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
    const [tasks, setTasks] = useState<Task[]>(mockTasks);
    const [calendarEvents, setCalendarEvents] =
        useState<CalendarEvent[]>(mockCalendarEvents);
    const [activeMeeting, setActiveMeeting] = useState<
        AppContextType['activeMeeting']
    >({
        isActive: false,
        transcript: [],
        insights: [],
    });

    const canPreviewRole = process.env.NODE_ENV === 'development';
    const effectiveAuthRole: MockAuthRole =
        authUser?.role === 'admin'
            ? 'admin'
            : canPreviewRole && authRole !== 'admin'
              ? authRole
              : 'free';
    const roleProfile = roleProfiles[effectiveAuthRole];

    const user = useMemo<User | null>(() => {
        if (!authUser) {
            return null;
        }

        const matchingOverride =
            userOverride?.email === authUser.email ? userOverride : null;

        return {
            ...mockUser,
            ...matchingOverride,
            id: authUser.email,
            email: authUser.email,
            name: authUser.name,
            subscription:
                matchingOverride?.subscription ?? mockUser.subscription,
        };
    }, [authUser, userOverride]);

    const effectiveUserRole: UserRole = isAuthenticated
        ? authUser?.role === 'admin'
            ? 'admin'
            : 'user'
        : null;

    const setAuthRole = (role: MockAuthRole) => {
        if (!canPreviewRole) {
            return;
        }

        if (role === 'admin' && authUser?.role !== 'admin') {
            return;
        }

        setAuthRoleState(role);
    };

    const setUserRole = (role: UserRole) => {
        if (!canPreviewRole) {
            return;
        }

        if (role === 'admin' && authUser?.role !== 'admin') {
            return;
        }

        if (role === 'admin') {
            setAuthRole('admin');
            return;
        }

        if (role === 'user' && authRole === 'admin') {
            setAuthRole('free');
        }
    };

    const login = async (email: string, password: string) => {
        await authLogin(email, password);
    };

    const logout = () => {
        authLogout();
    };

    const signup = async (email: string, password: string, name: string) => {
        await authRegister(name, email, password);
    };

    return (
        <AppContext.Provider
            value={{
                account: authUser,
                user,
                setUser: setUserOverride,
                userRole: effectiveUserRole,
                setUserRole,
                authRole: effectiveAuthRole,
                setAuthRole,
                roleProfile,
                roleProfiles,
                isAdmin: authUser?.role === 'admin',
                isPro: roleProfile.isPro,
                isFree: effectiveAuthRole === 'free',
                meetings,
                setMeetings,
                tasks,
                setTasks,
                calendarEvents,
                setCalendarEvents,
                activeMeeting,
                setActiveMeeting,
                isAuthenticated,
                login,
                logout,
                signup,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
