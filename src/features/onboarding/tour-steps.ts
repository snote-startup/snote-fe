import { DriveStep } from 'driver.js';

export const dashboardTourSteps: DriveStep[] = [
    {
        element: '[data-tour="sidebar"]',
        popover: {
            title: 'Sidebar Navigation',
            description:
                'Use the sidebar to move between your workspace, meeting projects, tasks, calendar, billing, and profile.',
            side: 'right',
            align: 'start',
        },
    },
    {
        element: '[data-tour="dashboard-header"]',
        popover: {
            title: 'Workspace Overview',
            description:
                'This is your workspace overview. Recent work metrics and projects now come from real backend APIs.',
            side: 'bottom',
            align: 'start',
        },
    },
    {
        element: '[data-tour="dashboard-recent-work"]',
        popover: {
            title: 'Recent Projects',
            description:
                'Your latest meeting projects appear here. Open any card to view transcripts and AI chat history.',
            side: 'top',
            align: 'start',
        },
    },
    {
        element: '[data-tour="dashboard-create-project"]',
        popover: {
            title: 'Create Project',
            description:
                'Start by creating a meeting project. Each project represents one meeting or translation session.',
            side: 'left',
            align: 'center',
        },
    },
    {
        element: '[data-tour="theme-toggle"]',
        popover: {
            title: 'Theme Switcher',
            description:
                'Switch between light and dark mode any time to suit your workspace preference.',
            side: 'top',
            align: 'end',
        },
    },
];

export const meetingsTourSteps: DriveStep[] = [
    {
        element: '[data-tour="projects-header"]',
        popover: {
            title: 'Projects Workspace',
            description:
                'Meeting Projects are the core workspace unit in SNote. This list replaces the old mock sessions.',
            side: 'bottom',
            align: 'start',
        },
    },
    {
        element: '[data-tour="create-project-button"]',
        popover: {
            title: 'Create a Project',
            description:
                'Create a project before uploading audio or reviewing transcripts.',
            side: 'bottom',
            align: 'end',
        },
    },
    {
        element: '[data-tour="project-search"]',
        popover: {
            title: 'Search Projects',
            description:
                'Filter your projects instantly by title or description details.',
            side: 'bottom',
            align: 'center',
        },
    },
    {
        element: '[data-tour="project-list"]',
        popover: {
            title: 'Projects Card list',
            description:
                'Each card shows the project metadata and whether audio has been uploaded. Open a card to view its transcripts and chat.',
            side: 'top',
            align: 'center',
        },
    },
];

export const projectDetailTourSteps: DriveStep[] = [
    {
        element: '[data-tour="project-detail-header"]',
        popover: {
            title: 'Project Details',
            description:
                'This is the project detail workspace. It represents one meeting session and holds all session outputs.',
            side: 'bottom',
            align: 'start',
        },
    },
    {
        element: '[data-tour="project-edit-button"]',
        popover: {
            title: 'Edit Details',
            description:
                'Update the project title and description here at any time.',
            side: 'bottom',
            align: 'end',
        },
    },
    {
        element: '[data-tour="project-tabs"]',
        popover: {
            title: 'Workspace Tabs',
            description:
                'Switch tabs to see the project overview details, transcripts, or ask the AI assistant questions.',
            side: 'bottom',
            align: 'start',
        },
    },
    {
        element: '[data-tour="upload-blocker-card"]',
        popover: {
            title: 'Audio Upload Status',
            description:
                'Audio upload is temporarily offline because the backend upload returns a 500 error. The UI is locked until backend upload is resolved.',
            side: 'left',
            align: 'center',
        },
    },
    {
        element: '[data-tour="project-transcript-tab"]',
        popover: {
            title: 'Speaker Transcripts',
            description:
                'Speaker transcripts, translation lines, and timestamps will render in this tab once audio processing succeeds.',
            side: 'top',
            align: 'center',
        },
    },
    {
        element: '[data-tour="project-chat-tab"]',
        popover: {
            title: 'AI Translation Chat',
            description:
                'Interact with your meetings through Q&A. Chat input is disabled here until the backend 502 gateway issue is resolved.',
            side: 'top',
            align: 'center',
        },
    },
    {
        element: '[data-tour="chat-blocker-card"]',
        popover: {
            title: 'AI References System',
            description:
                'Assistant answers will include references split by <<<REFERENCES>>> that map back to transcript segments.',
            side: 'top',
            align: 'center',
        },
    },
];
