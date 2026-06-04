'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    CheckCircle,
    Download,
    Share2,
    Edit,
    Trash2,
    Save,
    Calendar as CalendarIcon,
    FileText,
    List,
    MessageSquare,
} from 'lucide-react';
import { useApp } from '@/providers/snote-app-provider';
import { toast } from 'sonner';

const REVIEW_REFERENCE_TIME = Date.now();
const REVIEW_MEETING_DATE = new Date(REVIEW_REFERENCE_TIME);
const REVIEW_CALENDAR_DATE = new Date(
    REVIEW_REFERENCE_TIME + 4 * 60 * 60 * 1000,
);

export function MeetingReview() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const { meetings } = useApp();

    // Find meeting or use mock data for new meetings
    const meeting = meetings.find((m) => m.id === id) || {
        id: id || 'new',
        title: 'Team Standup',
        date: REVIEW_MEETING_DATE,
        duration: 15,
        inputLanguage: 'English',
        outputLanguage: 'English',
        status: 'draft' as const,
        transcript: [
            {
                id: 't1',
                timestamp: 5,
                speaker: 'Alex',
                text: "Alright team, let's get started with today's standup.",
            },
            {
                id: 't2',
                timestamp: 12,
                speaker: 'Sarah',
                text: 'I finished the dashboard redesign yesterday. Ready for review.',
            },
            {
                id: 't3',
                timestamp: 25,
                speaker: 'Mike',
                text: 'Great! I can review it this afternoon.',
            },
        ],
        summary:
            'Team standup discussing progress on dashboard redesign and upcoming reviews. Sarah completed the redesign work and Mike committed to reviewing it.',
        meetingMinutes: `**Attendees:** Alex, Sarah, Mike

**Topics Discussed:**
- Dashboard redesign completion
- Review scheduling

**Action Items:**
- Mike to review dashboard redesign this afternoon
- Sarah to prepare for client meeting on Friday

**Next Steps:**
Design review scheduled for this afternoon`,
        tasks: [
            {
                id: 'task1',
                title: 'Review dashboard redesign',
                description: 'Review the completed dashboard redesign work',
                status: 'todo' as const,
                priority: 'high' as const,
                assignee: 'Mike',
                meetingId: id,
                createdAt: REVIEW_MEETING_DATE,
            },
            {
                id: 'task2',
                title: 'Prepare client presentation',
                description: 'Create presentation for Friday client meeting',
                status: 'todo' as const,
                priority: 'medium' as const,
                assignee: 'Sarah',
                meetingId: id,
                createdAt: REVIEW_MEETING_DATE,
            },
        ],
        calendarSuggestions: [
            {
                id: 'cal1',
                title: 'Dashboard Design Review',
                date: REVIEW_CALENDAR_DATE,
                time: '14:00',
                duration: 30,
                meetingId: id,
                isApproved: false,
            },
        ],
        insights: [],
        tags: [],
    };

    const [summary, setSummary] = useState(meeting.summary);
    const [minutes, setMinutes] = useState(meeting.meetingMinutes);
    const [tasks, setTasks] = useState(meeting.tasks);
    const [calendarEvents, setCalendarEvents] = useState(
        meeting.calendarSuggestions,
    );

    const handleSave = () => {
        toast.success('Meeting saved successfully!');
        router.push('/meetings');
    };

    const handleExportPDF = () => {
        toast.success('Exporting meeting as PDF...');
    };

    const handleShare = () => {
        toast.success('Share link copied to clipboard!');
    };

    const handleTaskToggle = (taskId: string) => {
        setTasks(
            tasks.map((t) =>
                t.id === taskId
                    ? {
                          ...t,
                          status:
                              t.status === 'done' ? 'todo' : ('done' as const),
                      }
                    : t,
            ),
        );
    };

    const handleTaskDelete = (taskId: string) => {
        setTasks(tasks.filter((t) => t.id !== taskId));
        toast.success('Task deleted');
    };

    const handleCalendarApprove = (eventId: string) => {
        setCalendarEvents(
            calendarEvents.map((e) =>
                e.id === eventId ? { ...e, isApproved: !e.isApproved } : e,
            ),
        );
        toast.success('Calendar event approved');
    };

    return (
        <div className="h-full overflow-auto bg-gray-50">
            <div className="mx-auto max-w-6xl p-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="mb-4 flex items-start justify-between">
                        <div>
                            <h1 className="mb-2 text-3xl font-semibold text-gray-900">
                                {meeting.title}
                            </h1>
                            <p className="text-gray-600">
                                Meeting completed • {meeting.duration} minutes
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" onClick={handleShare}>
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                            </Button>
                            <Button variant="outline" onClick={handleExportPDF}>
                                <Download className="mr-2 h-4 w-4" />
                                Export PDF
                            </Button>
                            <Button onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Meeting
                            </Button>
                        </div>
                    </div>

                    {/* Success Banner */}
                    <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                            <p className="font-medium text-green-900">
                                Meeting processed successfully!
                            </p>
                            <p className="text-sm text-green-700">
                                AI has generated your summary, meeting minutes,
                                and action items. Review and edit below.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="summary" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="summary">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Summary
                        </TabsTrigger>
                        <TabsTrigger value="minutes">
                            <FileText className="mr-2 h-4 w-4" />
                            Meeting Minutes
                        </TabsTrigger>
                        <TabsTrigger value="tasks">
                            <List className="mr-2 h-4 w-4" />
                            Tasks ({tasks.length})
                        </TabsTrigger>
                        <TabsTrigger value="calendar">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Calendar ({calendarEvents.length})
                        </TabsTrigger>
                        <TabsTrigger value="transcript">
                            <FileText className="mr-2 h-4 w-4" />
                            Transcript
                        </TabsTrigger>
                    </TabsList>

                    {/* Summary Tab */}
                    <TabsContent value="summary" className="space-y-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-semibold text-gray-900">
                                    Meeting Summary
                                </h2>
                                <Button variant="ghost" size="sm">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                            </div>
                            <Textarea
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                className="min-h-[150px] resize-none"
                            />
                        </div>
                    </TabsContent>

                    {/* Minutes Tab */}
                    <TabsContent value="minutes" className="space-y-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-semibold text-gray-900">
                                    Meeting Minutes
                                </h2>
                                <Button variant="ghost" size="sm">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                            </div>
                            <Textarea
                                value={minutes}
                                onChange={(e) => setMinutes(e.target.value)}
                                className="min-h-[300px] resize-none font-mono text-sm"
                            />
                        </div>
                    </TabsContent>

                    {/* Tasks Tab */}
                    <TabsContent value="tasks" className="space-y-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">
                                Action Items
                            </h2>

                            {tasks.length === 0 ? (
                                <div className="py-8 text-center">
                                    <List className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                                    <p className="text-gray-600">
                                        No action items detected
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300"
                                        >
                                            <div className="flex items-start gap-3">
                                                <button
                                                    onClick={() =>
                                                        handleTaskToggle(
                                                            task.id,
                                                        )
                                                    }
                                                    className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 ${
                                                        task.status === 'done'
                                                            ? 'border-blue-600 bg-blue-600'
                                                            : 'border-gray-300 hover:border-blue-600'
                                                    }`}
                                                >
                                                    {task.status === 'done' && (
                                                        <CheckCircle className="h-3 w-3 fill-current text-white" />
                                                    )}
                                                </button>

                                                <div className="flex-1">
                                                    <Input
                                                        value={task.title}
                                                        onChange={(e) => {
                                                            setTasks(
                                                                tasks.map(
                                                                    (t) =>
                                                                        t.id ===
                                                                        task.id
                                                                            ? {
                                                                                  ...t,
                                                                                  title: e
                                                                                      .target
                                                                                      .value,
                                                                              }
                                                                            : t,
                                                                ),
                                                            );
                                                        }}
                                                        className="mb-2 font-medium"
                                                    />
                                                    {task.description && (
                                                        <p className="mb-2 text-sm text-gray-600">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        {task.assignee && (
                                                            <span>
                                                                Assignee:{' '}
                                                                {task.assignee}
                                                            </span>
                                                        )}
                                                        {task.priority && (
                                                            <span
                                                                className={`rounded-full px-2 py-0.5 text-xs ${
                                                                    task.priority ===
                                                                    'high'
                                                                        ? 'bg-red-100 text-red-700'
                                                                        : task.priority ===
                                                                            'medium'
                                                                          ? 'bg-yellow-100 text-yellow-700'
                                                                          : 'bg-gray-100 text-gray-700'
                                                                }`}
                                                            >
                                                                {task.priority}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleTaskDelete(
                                                            task.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Calendar Tab */}
                    <TabsContent value="calendar" className="space-y-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">
                                Calendar Suggestions
                            </h2>

                            {calendarEvents.length === 0 ? (
                                <div className="py-8 text-center">
                                    <CalendarIcon className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                                    <p className="text-gray-600">
                                        No calendar suggestions
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {calendarEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className={`rounded-lg border-2 p-4 transition-colors ${
                                                event.isApproved
                                                    ? 'border-green-300 bg-green-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="mb-2 font-medium text-gray-900">
                                                        {event.title}
                                                    </h3>
                                                    <div className="space-y-1 text-sm text-gray-600">
                                                        <p>
                                                            {event.date.toLocaleDateString()}{' '}
                                                            at {event.time}
                                                        </p>
                                                        <p>
                                                            {event.duration}{' '}
                                                            minutes
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() =>
                                                        handleCalendarApprove(
                                                            event.id,
                                                        )
                                                    }
                                                    variant={
                                                        event.isApproved
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    size="sm"
                                                >
                                                    {event.isApproved ? (
                                                        <>
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Approved
                                                        </>
                                                    ) : (
                                                        'Approve'
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Transcript Tab */}
                    <TabsContent value="transcript" className="space-y-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">
                                Full Transcript
                            </h2>
                            <ScrollArea className="h-96">
                                <div className="space-y-4 pr-4">
                                    {meeting.transcript.map((segment) => (
                                        <div
                                            key={segment.id}
                                            className="border-b border-gray-100 pb-4 last:border-0"
                                        >
                                            <div className="mb-1 flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {segment.speaker}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {Math.floor(
                                                        segment.timestamp / 60,
                                                    )}
                                                    :
                                                    {(segment.timestamp % 60)
                                                        .toString()
                                                        .padStart(2, '0')}
                                                </span>
                                            </div>
                                            <p className="text-gray-700">
                                                {segment.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
