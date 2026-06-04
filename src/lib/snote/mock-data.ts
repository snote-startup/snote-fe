// Mock data for the meeting assistant application

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    subscription: {
        plan: 'free' | 'pro' | 'enterprise' | 'trial';
        status: 'active' | 'expired' | 'cancelled';
        minutesLimit: number;
        minutesUsed: number;
        trialEndsAt?: Date;
        periodEndsAt?: Date;
    };
}

export interface Meeting {
    id: string;
    title: string;
    date: Date;
    duration: number; // in minutes
    inputLanguage: string;
    outputLanguage: string;
    status: 'draft' | 'completed';
    transcript: TranscriptSegment[];
    translation?: TranscriptSegment[];
    summary: string;
    meetingMinutes: string;
    tasks: Task[];
    calendarSuggestions: CalendarEvent[];
    insights: Insight[];
    tags: string[];
}

export interface TranscriptSegment {
    id: string;
    timestamp: number; // seconds from start
    speaker?: string;
    text: string;
    isHighlighted?: boolean;
    isBookmarked?: boolean;
}

export interface Insight {
    id: string;
    type: 'task' | 'decision' | 'key-point';
    text: string;
    timestamp: number;
    confidence: number;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'draft' | 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
    assignee?: string;
    meetingId?: string;
    transcriptSegmentId?: string;
    createdAt: Date;
}

export interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    time: string;
    duration: number;
    meetingId?: string;
    isApproved: boolean;
}

// Mock user data
export const mockUser: User = {
    id: '1',
    email: 'user@example.com',
    name: 'Alex Johnson',
    subscription: {
        plan: 'trial',
        status: 'active',
        minutesLimit: 300,
        minutesUsed: 145,
        trialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    },
};

// Mock meetings data
export const mockMeetings: Meeting[] = [
    {
        id: '1',
        title: 'Product Roadmap Q1 2026',
        date: new Date('2026-03-03T10:00:00'),
        duration: 45,
        inputLanguage: 'English',
        outputLanguage: 'English',
        status: 'completed',
        transcript: [
            {
                id: 't1',
                timestamp: 0,
                speaker: 'Alex Johnson',
                text: "Good morning everyone. Let's start with reviewing our Q1 roadmap priorities.",
            },
            {
                id: 't2',
                timestamp: 15,
                speaker: 'Sarah Chen',
                text: "I've prepared the analytics dashboard mockups. We should prioritize the user feedback integration.",
                isHighlighted: true,
            },
            {
                id: 't3',
                timestamp: 45,
                speaker: 'Mike Rodriguez',
                text: 'Agreed. I think we can deliver the API improvements by end of month.',
            },
            {
                id: 't4',
                timestamp: 70,
                speaker: 'Alex Johnson',
                text: 'Great. Sarah, can you schedule a design review for next week?',
                isBookmarked: true,
            },
            {
                id: 't5',
                timestamp: 90,
                speaker: 'Sarah Chen',
                text: "Will do. I'll send calendar invites by EOD.",
            },
        ],
        summary:
            'The team reviewed Q1 2026 product roadmap priorities, focusing on analytics dashboard development and API improvements. Key decisions were made regarding user feedback integration and timeline commitments for end-of-month delivery.',
        meetingMinutes: `**Attendees:** Alex Johnson, Sarah Chen, Mike Rodriguez

**Agenda:**
- Q1 2026 Roadmap Review
- Analytics Dashboard Updates
- API Improvement Timeline

**Key Discussions:**
1. Analytics Dashboard Priority
   - Sarah presented mockups for the new dashboard
   - Decision to prioritize user feedback integration

2. API Improvements
   - Mike committed to delivery by end of month
   - Team aligned on technical approach

**Action Items:**
- Sarah to schedule design review for next week
- Sarah to send calendar invites by EOD
- Mike to provide API timeline estimates

**Next Steps:**
Design review meeting scheduled for March 10, 2026`,
        tasks: [
            {
                id: 'task1',
                title: 'Schedule design review meeting',
                description:
                    'Set up design review for analytics dashboard mockups',
                status: 'done',
                priority: 'high',
                dueDate: new Date('2026-03-10'),
                assignee: 'Sarah Chen',
                meetingId: '1',
                transcriptSegmentId: 't4',
                createdAt: new Date('2026-03-03'),
            },
            {
                id: 'task2',
                title: 'Send calendar invites',
                description: 'Send invites for design review meeting',
                status: 'done',
                priority: 'medium',
                assignee: 'Sarah Chen',
                meetingId: '1',
                createdAt: new Date('2026-03-03'),
            },
        ],
        calendarSuggestions: [
            {
                id: 'cal1',
                title: 'Design Review - Analytics Dashboard',
                date: new Date('2026-03-10'),
                time: '14:00',
                duration: 60,
                meetingId: '1',
                isApproved: true,
            },
        ],
        insights: [
            {
                id: 'i1',
                type: 'decision',
                text: 'Prioritize user feedback integration in analytics dashboard',
                timestamp: 15,
                confidence: 0.92,
            },
            {
                id: 'i2',
                type: 'task',
                text: 'Schedule design review for next week',
                timestamp: 70,
                confidence: 0.88,
            },
        ],
        tags: ['product', 'roadmap', 'q1-2026'],
    },
    {
        id: '2',
        title: 'Customer Success Team Sync',
        date: new Date('2026-03-01T14:30:00'),
        duration: 30,
        inputLanguage: 'English',
        outputLanguage: 'English',
        status: 'completed',
        transcript: [
            {
                id: 't6',
                timestamp: 0,
                speaker: 'Emma Wilson',
                text: "Let's review this week's customer feedback trends.",
            },
            {
                id: 't7',
                timestamp: 20,
                speaker: 'David Park',
                text: "We've seen a 15% increase in positive sentiment around our new onboarding flow.",
            },
            {
                id: 't8',
                timestamp: 50,
                speaker: 'Emma Wilson',
                text: 'Excellent. Any major pain points we should address?',
            },
            {
                id: 't9',
                timestamp: 75,
                speaker: 'Lisa Martinez',
                text: "Some users are requesting better mobile support. I'll compile a detailed report.",
            },
        ],
        summary:
            'Customer Success team reviewed weekly feedback trends. Notable 15% increase in positive sentiment for new onboarding. Mobile support improvement identified as key user request.',
        meetingMinutes: `**Attendees:** Emma Wilson, David Park, Lisa Martinez

**Topics Discussed:**
- Weekly customer feedback review
- Onboarding flow performance (15% increase in positive sentiment)
- Mobile support requests

**Action Items:**
- Lisa to compile mobile support feature request report`,
        tasks: [
            {
                id: 'task3',
                title: 'Compile mobile support feature requests',
                description:
                    'Create detailed report on mobile support user requests',
                status: 'in-progress',
                priority: 'high',
                dueDate: new Date('2026-03-05'),
                assignee: 'Lisa Martinez',
                meetingId: '2',
                createdAt: new Date('2026-03-01'),
            },
        ],
        calendarSuggestions: [],
        insights: [
            {
                id: 'i3',
                type: 'key-point',
                text: '15% increase in positive sentiment for onboarding',
                timestamp: 20,
                confidence: 0.95,
            },
            {
                id: 'i4',
                type: 'task',
                text: 'Compile mobile support feature request report',
                timestamp: 75,
                confidence: 0.9,
            },
        ],
        tags: ['customer-success', 'feedback'],
    },
    {
        id: '3',
        title: 'Engineering Standup',
        date: new Date('2026-02-28T09:00:00'),
        duration: 15,
        inputLanguage: 'English',
        outputLanguage: 'English',
        status: 'completed',
        transcript: [
            {
                id: 't10',
                timestamp: 0,
                speaker: 'Tech Lead',
                text: 'Quick updates everyone. What did you work on yesterday?',
            },
            {
                id: 't11',
                timestamp: 10,
                speaker: 'Developer 1',
                text: 'Finished the authentication refactor. Ready for code review.',
            },
            {
                id: 't12',
                timestamp: 25,
                speaker: 'Developer 2',
                text: 'Working on database optimization. Should be done by EOD.',
            },
        ],
        summary:
            'Daily engineering standup. Team shared progress on authentication refactor and database optimization work.',
        meetingMinutes: `**Daily Standup - Feb 28, 2026**

Updates:
- Authentication refactor completed, pending code review
- Database optimization in progress, target completion EOD`,
        tasks: [],
        calendarSuggestions: [],
        insights: [],
        tags: ['engineering', 'standup'],
    },
];

// Mock tasks (including standalone tasks not linked to meetings)
export const mockTasks: Task[] = [
    ...mockMeetings.flatMap((m) => m.tasks),
    {
        id: 'task4',
        title: 'Update documentation for API v2',
        description:
            'Comprehensive documentation update for the new API version',
        status: 'todo',
        priority: 'high',
        dueDate: new Date('2026-03-08'),
        assignee: 'Mike Rodriguez',
        createdAt: new Date('2026-03-01'),
    },
    {
        id: 'task5',
        title: 'Review security audit report',
        description: 'Review and address items from Q1 security audit',
        status: 'todo',
        priority: 'high',
        dueDate: new Date('2026-03-06'),
        assignee: 'Alex Johnson',
        createdAt: new Date('2026-02-28'),
    },
    {
        id: 'task6',
        title: 'Prepare investor deck',
        description: 'Update investor presentation with Q1 metrics',
        status: 'in-progress',
        priority: 'medium',
        dueDate: new Date('2026-03-12'),
        assignee: 'Alex Johnson',
        createdAt: new Date('2026-02-25'),
    },
    {
        id: 'task7',
        title: 'Conduct user interviews',
        description: 'Interview 5 users about new feature requests',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2026-03-15'),
        assignee: 'Sarah Chen',
        createdAt: new Date('2026-03-02'),
    },
];

// Mock calendar events
export const mockCalendarEvents: CalendarEvent[] = [
    ...mockMeetings.flatMap((m) =>
        m.calendarSuggestions.filter((c) => c.isApproved),
    ),
    {
        id: 'cal2',
        title: 'Team All-Hands',
        date: new Date('2026-03-07'),
        time: '10:00',
        duration: 60,
        isApproved: true,
    },
    {
        id: 'cal3',
        title: 'Client Demo',
        date: new Date('2026-03-08'),
        time: '15:00',
        duration: 45,
        isApproved: true,
    },
    {
        id: 'cal4',
        title: '1:1 with Sarah',
        date: new Date('2026-03-06'),
        time: '11:00',
        duration: 30,
        isApproved: true,
    },
];
