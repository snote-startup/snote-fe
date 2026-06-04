'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowLeft,
    Edit,
    Download,
    Share2,
    Trash2,
    RefreshCw,
    FileText,
    List,
    Calendar as CalendarIcon,
    MessageSquare,
    Save,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useApp } from '@/providers/snote-app-provider';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function MeetingDetail() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const { meetings, setMeetings } = useApp();

    const meeting = meetings.find((m) => m.id === id);

    const [isEditing, setIsEditing] = useState(false);
    const [summary, setSummary] = useState(meeting?.summary || '');
    const [minutes, setMinutes] = useState(meeting?.meetingMinutes || '');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);

    if (!meeting) {
        return (
            <div className="mx-auto max-w-4xl p-8 text-center">
                <h1 className="mb-4 text-2xl font-semibold text-gray-900">
                    Meeting not found
                </h1>
                <Button onClick={() => router.push('/meetings')}>
                    Back to Meetings
                </Button>
            </div>
        );
    }

    const handleSave = () => {
        setMeetings(
            meetings.map((m) =>
                m.id === id ? { ...m, summary, meetingMinutes: minutes } : m,
            ),
        );
        setIsEditing(false);
        toast.success('Changes saved');
    };

    const handleDelete = () => {
        setMeetings(meetings.filter((m) => m.id !== id));
        toast.success('Meeting deleted');
        router.push('/meetings');
    };

    const handleRegenerate = () => {
        toast.success('Regenerating meeting minutes...');
        setShowRegenerateDialog(false);
    };

    const handleExport = () => {
        toast.success('Exporting as PDF...');
    };

    const handleShare = () => {
        toast.success('Share link copied to clipboard!');
    };

    return (
        <>
            <div className="h-full overflow-auto bg-gray-50">
                <div className="mx-auto max-w-6xl p-8">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/meetings')}
                        className="mb-6"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Meetings
                    </Button>

                    {/* Header */}
                    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
                        <div className="mb-4 flex items-start justify-between">
                            <div>
                                <h1 className="mb-3 text-3xl font-semibold text-gray-900">
                                    {meeting.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                    <span>
                                        {format(meeting.date, 'MMMM d, yyyy')}
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {format(meeting.date, 'h:mm a')}
                                    </span>
                                    <span>•</span>
                                    <span>{meeting.duration} minutes</span>
                                    <span>•</span>
                                    <span>{meeting.inputLanguage}</span>
                                </div>
                            </div>

                            <div
                                className={`rounded-full px-3 py-1 text-sm font-medium ${
                                    meeting.status === 'completed'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}
                            >
                                {meeting.status}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                {isEditing ? 'Cancel Edit' : 'Edit'}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleShare}
                            >
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExport}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Export PDF
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowRegenerateDialog(true)}
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Regenerate
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                    </div>

                    {/* Content Tabs */}
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
                                Tasks ({meeting.tasks.length})
                            </TabsTrigger>
                            <TabsTrigger value="calendar">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Calendar Events
                            </TabsTrigger>
                            <TabsTrigger value="transcript">
                                <FileText className="mr-2 h-4 w-4" />
                                Full Transcript
                            </TabsTrigger>
                        </TabsList>

                        {/* Summary */}
                        <TabsContent value="summary">
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h2 className="mb-4 font-semibold text-gray-900">
                                    Meeting Summary
                                </h2>
                                {isEditing ? (
                                    <>
                                        <Textarea
                                            value={summary}
                                            onChange={(e) =>
                                                setSummary(e.target.value)
                                            }
                                            className="mb-4 min-h-[200px]"
                                        />
                                        <Button onClick={handleSave}>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </Button>
                                    </>
                                ) : (
                                    <p className="whitespace-pre-wrap text-gray-700">
                                        {summary}
                                    </p>
                                )}
                            </div>
                        </TabsContent>

                        {/* Minutes */}
                        <TabsContent value="minutes">
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h2 className="mb-4 font-semibold text-gray-900">
                                    Meeting Minutes
                                </h2>
                                {isEditing ? (
                                    <>
                                        <Textarea
                                            value={minutes}
                                            onChange={(e) =>
                                                setMinutes(e.target.value)
                                            }
                                            className="mb-4 min-h-[400px] font-mono text-sm"
                                        />
                                        <Button onClick={handleSave}>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </Button>
                                    </>
                                ) : (
                                    <pre className="font-mono text-sm whitespace-pre-wrap text-gray-700">
                                        {minutes}
                                    </pre>
                                )}
                            </div>
                        </TabsContent>

                        {/* Tasks */}
                        <TabsContent value="tasks">
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="font-semibold text-gray-900">
                                        Action Items
                                    </h2>
                                    <Button
                                        size="sm"
                                        onClick={() => router.push('/tasks')}
                                    >
                                        View in Task Board
                                    </Button>
                                </div>

                                {meeting.tasks.length === 0 ? (
                                    <div className="py-8 text-center">
                                        <List className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                                        <p className="text-gray-600">
                                            No tasks for this meeting
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {meeting.tasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className="rounded-lg border border-gray-200 p-4 hover:border-gray-300"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className={`mt-0.5 h-5 w-5 rounded border-2 ${
                                                            task.status ===
                                                            'done'
                                                                ? 'border-blue-600 bg-blue-600'
                                                                : 'border-gray-300'
                                                        }`}
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">
                                                            {task.title}
                                                        </p>
                                                        {task.description && (
                                                            <p className="mt-1 text-sm text-gray-600">
                                                                {
                                                                    task.description
                                                                }
                                                            </p>
                                                        )}
                                                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                                                            {task.assignee && (
                                                                <span>
                                                                    Assignee:{' '}
                                                                    {
                                                                        task.assignee
                                                                    }
                                                                </span>
                                                            )}
                                                            {task.dueDate && (
                                                                <span>
                                                                    Due:{' '}
                                                                    {format(
                                                                        task.dueDate,
                                                                        'MMM d',
                                                                    )}
                                                                </span>
                                                            )}
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
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* Calendar */}
                        <TabsContent value="calendar">
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h2 className="mb-4 font-semibold text-gray-900">
                                    Calendar Events
                                </h2>

                                {meeting.calendarSuggestions.filter(
                                    (c) => c.isApproved,
                                ).length === 0 ? (
                                    <div className="py-8 text-center">
                                        <CalendarIcon className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                                        <p className="text-gray-600">
                                            No calendar events
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {meeting.calendarSuggestions
                                            .filter((c) => c.isApproved)
                                            .map((event) => (
                                                <div
                                                    key={event.id}
                                                    className="rounded-lg border border-gray-200 p-4"
                                                >
                                                    <h3 className="mb-2 font-medium text-gray-900">
                                                        {event.title}
                                                    </h3>
                                                    <div className="space-y-1 text-sm text-gray-600">
                                                        <p>
                                                            {format(
                                                                event.date,
                                                                'MMMM d, yyyy',
                                                            )}{' '}
                                                            at {event.time}
                                                        </p>
                                                        <p>
                                                            {event.duration}{' '}
                                                            minutes
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* Transcript */}
                        <TabsContent value="transcript">
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
                                                        {segment.speaker ||
                                                            'Unknown'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {Math.floor(
                                                            segment.timestamp /
                                                                60,
                                                        )}
                                                        :
                                                        {(
                                                            segment.timestamp %
                                                            60
                                                        )
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Meeting?</DialogTitle>
                        <DialogDescription>
                            This will permanently delete this meeting and all
                            associated data including tasks and calendar events.
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete Meeting
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Regenerate Dialog */}
            <Dialog
                open={showRegenerateDialog}
                onOpenChange={setShowRegenerateDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Regenerate Meeting Minutes?</DialogTitle>
                        <DialogDescription>
                            AI will re-analyze the transcript and generate new
                            meeting minutes, summary, and action items. This
                            will replace the current content.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowRegenerateDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleRegenerate}>Regenerate</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
