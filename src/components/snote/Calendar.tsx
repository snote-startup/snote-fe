'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    ExternalLink,
    Trash2,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { useApp } from '@/providers/snote-app-provider';
import type { CalendarEvent } from '@/lib/snote/mock-data';
import { toast } from 'sonner';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    isSameMonth,
    addMonths,
    subMonths,
} from 'date-fns';

export function Calendar() {
    const router = useRouter();
    const { calendarEvents, setCalendarEvents, meetings } = useApp();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
        null,
    );
    const [showEventDialog, setShowEventDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Get the first day of the month (0 = Sunday, 6 = Saturday)
    const firstDayOfMonth = monthStart.getDay();

    // Create array for calendar grid
    const calendarDays: (Date | null)[] = [
        ...Array(firstDayOfMonth).fill(null),
        ...daysInMonth,
    ];

    const getEventsForDay = (date: Date) => {
        return calendarEvents.filter((event) =>
            isSameDay(new Date(event.date), date),
        );
    };

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setShowEventDialog(true);
    };

    const handleDeleteEvent = () => {
        if (selectedEvent) {
            setCalendarEvents(
                calendarEvents.filter((e) => e.id !== selectedEvent.id),
            );
            toast.success('Event deleted');
            setShowDeleteDialog(false);
            setShowEventDialog(false);
        }
    };

    const handleGoToMeeting = (meetingId: string) => {
        router.push(`/meetings/${meetingId}`);
        setShowEventDialog(false);
    };

    const handlePreviousMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    return (
        <>
            <div className="mx-auto max-w-7xl p-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h1 className="mb-2 text-3xl font-semibold text-gray-900">
                                Calendar
                            </h1>
                            <p className="text-gray-600">
                                View and manage your meeting-related calendar
                                events
                            </p>
                        </div>
                    </div>

                    {/* Calendar Controls */}
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePreviousMonth}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <h2 className="min-w-[200px] text-center text-lg font-semibold text-gray-900">
                                {format(currentDate, 'MMMM yyyy')}
                            </h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextMonth}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleToday}
                        >
                            Today
                        </Button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 border-b border-gray-200">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="border-r border-gray-200 p-3 text-center text-sm font-medium text-gray-600 last:border-r-0"
                                >
                                    {day}
                                </div>
                            ),
                        )}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7">
                        {calendarDays.map((day, index) => {
                            if (!day) {
                                return (
                                    <div
                                        key={`empty-${index}`}
                                        className="h-32 border-r border-b border-gray-200 bg-gray-50 last:border-r-0"
                                    />
                                );
                            }

                            const dayEvents = getEventsForDay(day);
                            const isToday = isSameDay(day, new Date());
                            const isCurrentMonth = isSameMonth(
                                day,
                                currentDate,
                            );

                            return (
                                <div
                                    key={day.toISOString()}
                                    className={`h-32 border-r border-b border-gray-200 p-2 last:border-r-0 ${
                                        !isCurrentMonth ? 'bg-gray-50' : ''
                                    }`}
                                >
                                    {/* Day Number */}
                                    <div className="mb-1 flex items-center justify-between">
                                        <span
                                            className={`text-sm font-medium ${
                                                isToday
                                                    ? 'flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white'
                                                    : !isCurrentMonth
                                                      ? 'text-gray-400'
                                                      : 'text-gray-900'
                                            }`}
                                        >
                                            {format(day, 'd')}
                                        </span>
                                    </div>

                                    {/* Events */}
                                    <div className="space-y-1">
                                        {dayEvents.slice(0, 2).map((event) => (
                                            <button
                                                key={event.id}
                                                onClick={() =>
                                                    handleEventClick(event)
                                                }
                                                className="w-full truncate rounded bg-blue-100 px-2 py-1 text-left text-xs text-blue-900 transition-colors hover:bg-blue-200"
                                            >
                                                {event.time} - {event.title}
                                            </button>
                                        ))}
                                        {dayEvents.length > 2 && (
                                            <div className="px-2 text-xs text-gray-500">
                                                +{dayEvents.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="mb-4 font-semibold text-gray-900">
                        Upcoming Events
                    </h2>

                    {calendarEvents.length === 0 ? (
                        <div className="py-8 text-center">
                            <CalendarIcon className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                            <p className="text-gray-600">No upcoming events</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {calendarEvents
                                .filter(
                                    (event) =>
                                        new Date(event.date) >= new Date(),
                                )
                                .sort(
                                    (a, b) =>
                                        new Date(a.date).getTime() -
                                        new Date(b.date).getTime(),
                                )
                                .slice(0, 5)
                                .map((event) => {
                                    const eventMeeting = event.meetingId
                                        ? meetings.find(
                                              (m) => m.id === event.meetingId,
                                          )
                                        : null;

                                    return (
                                        <div
                                            key={event.id}
                                            onClick={() =>
                                                handleEventClick(event)
                                            }
                                            className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/50"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="mb-1 font-medium text-gray-900">
                                                        {event.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <CalendarIcon className="h-4 w-4" />
                                                            {format(
                                                                new Date(
                                                                    event.date,
                                                                ),
                                                                'MMM d, yyyy',
                                                            )}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            {event.time}
                                                        </span>
                                                        <span>
                                                            {event.duration} min
                                                        </span>
                                                    </div>
                                                    {eventMeeting && (
                                                        <p className="mt-2 text-xs text-blue-600">
                                                            From:{' '}
                                                            {eventMeeting.title}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </div>

            {/* Event Detail Dialog */}
            <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedEvent?.title}</DialogTitle>
                    </DialogHeader>

                    {selectedEvent && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Date & Time
                                </label>
                                <p className="mt-1 text-gray-900">
                                    {format(
                                        new Date(selectedEvent.date),
                                        'MMMM d, yyyy',
                                    )}{' '}
                                    at {selectedEvent.time}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Duration
                                </label>
                                <p className="mt-1 text-gray-900">
                                    {selectedEvent.duration} minutes
                                </p>
                            </div>

                            {selectedEvent.meetingId && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Related Meeting
                                    </label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleGoToMeeting(
                                                selectedEvent.meetingId!,
                                            )
                                        }
                                        className="mt-2 w-full justify-start"
                                    >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        View Meeting Details
                                    </Button>
                                </div>
                            )}

                            <div className="flex gap-2 border-t border-gray-200 pt-4">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowEventDialog(false)}
                                >
                                    Close
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        setShowEventDialog(false);
                                        setShowDeleteDialog(true);
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Event?</DialogTitle>
                        <DialogDescription>
                            This will permanently delete this calendar event.
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
                        <Button
                            variant="destructive"
                            onClick={handleDeleteEvent}
                        >
                            Delete Event
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
