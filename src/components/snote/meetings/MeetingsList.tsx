'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, Calendar, Clock, CheckCircle, FolderOpen } from 'lucide-react';
import { useApp } from '@/providers/snote-app-provider';
import { format } from 'date-fns';

export function MeetingsList() {
    const router = useRouter();
    const { meetings } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [languageFilter, setLanguageFilter] = useState('all');

    // Filter meetings
    const filteredMeetings = meetings.filter((meeting) => {
        const matchesSearch = meeting.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesDate =
            dateFilter === 'all' ||
            (() => {
                const now = new Date();
                const meetingDate = new Date(meeting.date);
                switch (dateFilter) {
                    case 'today':
                        return (
                            meetingDate.toDateString() === now.toDateString()
                        );
                    case 'week':
                        const weekAgo = new Date(
                            now.getTime() - 7 * 24 * 60 * 60 * 1000,
                        );
                        return meetingDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(
                            now.getTime() - 30 * 24 * 60 * 60 * 1000,
                        );
                        return meetingDate >= monthAgo;
                    default:
                        return true;
                }
            })();
        const matchesLanguage =
            languageFilter === 'all' ||
            meeting.inputLanguage.toLowerCase() === languageFilter;

        return matchesSearch && matchesDate && matchesLanguage;
    });

    return (
        <div className="mx-auto max-w-7xl p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="mb-2 text-3xl font-semibold text-gray-900">
                    Meetings
                </h1>
                <p className="text-gray-600">
                    View and manage all your recorded meetings
                </p>
            </div>

            {/* Filters */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <Input
                                placeholder="Search meetings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Date Filter */}
                    <div>
                        <Select
                            value={dateFilter}
                            onValueChange={setDateFilter}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Date range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All dates</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="week">Past week</SelectItem>
                                <SelectItem value="month">
                                    Past month
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Language Filter */}
                    <div>
                        <Select
                            value={languageFilter}
                            onValueChange={setLanguageFilter}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All languages
                                </SelectItem>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="spanish">Spanish</SelectItem>
                                <SelectItem value="french">French</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Meetings List */}
            {filteredMeetings.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                    <FolderOpen className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                    <h2 className="mb-2 text-xl font-semibold text-gray-900">
                        {searchQuery ||
                        dateFilter !== 'all' ||
                        languageFilter !== 'all'
                            ? 'No meetings found'
                            : 'No meetings yet'}
                    </h2>
                    <p className="mb-6 text-gray-600">
                        {searchQuery ||
                        dateFilter !== 'all' ||
                        languageFilter !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Start recording meetings to see them here'}
                    </p>
                    {!searchQuery &&
                        dateFilter === 'all' &&
                        languageFilter === 'all' && (
                            <Button
                                onClick={() =>
                                    router.push('/live-assistant/setup')
                                }
                            >
                                Start Your First Meeting
                            </Button>
                        )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredMeetings.map((meeting) => (
                        <div
                            key={meeting.id}
                            onClick={() =>
                                router.push(`/meetings/${meeting.id}`)
                            }
                            className="cursor-pointer rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                        {meeting.title}
                                    </h3>

                                    <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {format(
                                                    meeting.date,
                                                    'MMM d, yyyy',
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4" />
                                            <span>{meeting.duration} min</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span>
                                                🌐 {meeting.inputLanguage}
                                            </span>
                                        </div>
                                        {meeting.tasks.length > 0 && (
                                            <div className="flex items-center gap-1.5">
                                                <CheckCircle className="h-4 w-4" />
                                                <span>
                                                    {meeting.tasks.length} tasks
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <p className="line-clamp-2 text-gray-700">
                                        {meeting.summary}
                                    </p>

                                    {meeting.tags.length > 0 && (
                                        <div className="mt-3 flex items-center gap-2">
                                            {meeting.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                        meeting.status === 'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}
                                >
                                    {meeting.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Results count */}
            {filteredMeetings.length > 0 && (
                <div className="mt-6 text-center text-sm text-gray-600">
                    Showing {filteredMeetings.length} of {meetings.length}{' '}
                    meetings
                </div>
            )}
        </div>
    );
}
