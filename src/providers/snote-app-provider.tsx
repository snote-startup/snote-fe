'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
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

const mockUsersByRole: Record<MockAuthRole, User> = {
    free: {
        ...mockUser,
        id: 'free-user',
        email: 'free.user@snote.ai',
        name: 'Alex Free',
        subscription: {
            plan: 'free',
            status: 'active',
            minutesLimit: 120,
            minutesUsed: 96,
        },
    },
    pro: {
        ...mockUser,
        id: 'pro-user',
        email: 'pro.user@snote.ai',
        name: 'Priya Pro',
        subscription: {
            plan: 'pro',
            status: 'active',
            minutesLimit: 999999,
            minutesUsed: 1260,
        },
    },
    admin: {
        ...mockUser,
        id: 'admin-user',
        email: 'admin@snote.ai',
        name: 'Morgan Admin',
        subscription: {
            plan: 'enterprise',
            status: 'active',
            minutesLimit: 999999,
            minutesUsed: 28450,
        },
    },
};

interface AppContextType {
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
    const [authRole, setAuthRoleState] = useState<MockAuthRole>('free');
    const [user, setUser] = useState<User | null>(mockUsersByRole.free);
    const [, setUserRoleState] = useState<UserRole>('user');
    const [isAuthenticated, setIsAuthenticated] = useState(true);
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

    const effectiveAuthRole: MockAuthRole = authRole;
    const roleProfile = roleProfiles[effectiveAuthRole];

    const effectiveUserRole: UserRole = isAuthenticated
        ? effectiveAuthRole === 'admin'
            ? 'admin'
            : 'user'
        : null;

    const setAuthRole = (role: MockAuthRole) => {
        setAuthRoleState(role);
        setUserRoleState(role === 'admin' ? 'admin' : 'user');
        setUser(mockUsersByRole[role]);
        setIsAuthenticated(true);
    };

    const setUserRole = (role: UserRole) => {
        setUserRoleState(role);

        if (role === 'admin') {
            setAuthRole('admin');
            return;
        }

        if (role === 'user' && authRole === 'admin') {
            setAuthRole('free');
        }
    };

    const login = async (email: string, password: string) => {
        void password;
        const nextRole: MockAuthRole = email.toLowerCase().includes('admin')
            ? 'admin'
            : email.toLowerCase().includes('pro')
              ? 'pro'
              : 'free';

        setAuthRoleState(nextRole);
        setUserRoleState(nextRole === 'admin' ? 'admin' : 'user');
        setUser({
            ...mockUsersByRole[nextRole],
            email: email || mockUsersByRole[nextRole].email,
        });
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    const signup = async (email: string, password: string, name: string) => {
        void password;
        setAuthRoleState('free');
        setUserRoleState('user');
        setUser({
            ...mockUsersByRole.free,
            id: email || 'new-user',
            email,
            name: name || 'SNOTE User',
        });
        setIsAuthenticated(true);
    };

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                userRole: effectiveUserRole,
                setUserRole,
                authRole: effectiveAuthRole,
                setAuthRole,
                roleProfile,
                roleProfiles,
                isAdmin: roleProfile.isAdmin,
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
