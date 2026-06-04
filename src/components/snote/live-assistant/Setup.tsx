'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Mic, Settings, AlertCircle } from 'lucide-react';
import { useApp } from '@/providers/snote-app-provider';

export function LiveAssistantSetup() {
    const router = useRouter();
    const { user } = useApp();
    const [title, setTitle] = useState('');
    const [inputLanguage, setInputLanguage] = useState('english');
    const [outputLanguage, setOutputLanguage] = useState('english');
    const [industry, setIndustry] = useState('general');
    const [audioSources, setAudioSources] = useState<string[]>(['microphone']);

    const minutesRemaining = user
        ? user.subscription.minutesLimit - user.subscription.minutesUsed
        : 0;
    const canStartMeeting = minutesRemaining > 0;

    const handleStart = () => {
        if (!canStartMeeting) {
            // Show upgrade modal (we'll handle this in the routing)
            router.push('/pricing');
            return;
        }
        router.push('/live-assistant/permissions');
    };

    const languages = [
        { value: 'japanese', label: 'Japanese' },
        { value: 'chinese', label: 'Chinese' },
        { value: 'english', label: 'English' },
        { value: 'vietnamese', label: 'Vietnamese' },
    ];

    const industries = [
        { value: 'general', label: 'General' },
        { value: 'technology', label: 'Technology / IT' },
        { value: 'medical', label: 'Medical / Healthcare' },
        { value: 'finance', label: 'Finance / Banking' },
        { value: 'legal', label: 'Legal' },
        { value: 'engineering', label: 'Engineering' },
        { value: 'marketing', label: 'Marketing' },
    ];

    const audioSourceOptions = [
        {
            value: 'microphone',
            label: 'Microphone',
            description: 'Record from your microphone',
        },
        {
            value: 'tab-audio',
            label: 'Browser Tab Audio',
            description: 'Record audio from a browser tab',
        },
        {
            value: 'system-audio',
            label: 'System Audio',
            description: 'Record all system audio',
        },
    ];

    const toggleAudioSource = (value: string) => {
        if (audioSources.includes(value)) {
            setAudioSources(audioSources.filter((s) => s !== value));
        } else {
            setAudioSources([...audioSources, value]);
        }
    };

    return (
        <div className="mx-auto max-w-4xl p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-semibold text-gray-900">
                    Start Live Assistant
                </h1>
                <p className="text-gray-600">
                    Configure your meeting settings to begin recording and
                    transcription
                </p>
            </div>

            {/* Low Minutes Warning */}
            {minutesRemaining < 30 && minutesRemaining > 0 && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                    <div>
                        <p className="font-medium text-yellow-900">
                            Low on minutes
                        </p>
                        <p className="mt-1 text-sm text-yellow-700">
                            You have {minutesRemaining} minutes remaining.
                            Consider upgrading to continue recording longer
                            meetings.
                        </p>
                    </div>
                </div>
            )}

            {/* No Minutes Warning */}
            {!canStartMeeting && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                    <div className="flex-1">
                        <p className="font-medium text-red-900">
                            No minutes remaining
                        </p>
                        <p className="mt-1 text-sm text-red-700">
                            You&apos;ve used all your meeting minutes. Upgrade
                            your plan to continue recording meetings.
                        </p>
                    </div>
                    <Button onClick={() => router.push('/pricing')} size="sm">
                        Upgrade
                    </Button>
                </div>
            )}

            {/* Setup Form */}
            <div className="rounded-xl border border-gray-200 bg-white p-8">
                <div className="space-y-6">
                    {/* Meeting Title */}
                    <div>
                        <Label htmlFor="title">Meeting Title (Optional)</Label>
                        <Input
                            id="title"
                            type="text"
                            placeholder="e.g., Product Team Standup"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-2"
                        />
                        <p className="mt-1.5 text-sm text-gray-500">
                            Leave blank to auto-generate a title
                        </p>
                    </div>

                    {/* Languages */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <Label htmlFor="input-language">
                                Input Language
                            </Label>
                            <Select
                                value={inputLanguage}
                                onValueChange={setInputLanguage}
                            >
                                <SelectTrigger className="mt-2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map((lang) => (
                                        <SelectItem
                                            key={lang.value}
                                            value={lang.value}
                                        >
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="mt-1.5 text-sm text-gray-500">
                                Language being spoken in the meeting
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="output-language">
                                Output Language
                            </Label>
                            <Select
                                value={outputLanguage}
                                onValueChange={setOutputLanguage}
                            >
                                <SelectTrigger className="mt-2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map((lang) => (
                                        <SelectItem
                                            key={lang.value}
                                            value={lang.value}
                                        >
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="mt-1.5 text-sm text-gray-500">
                                Translate transcript to this language
                            </p>
                        </div>
                    </div>

                    {/* Industry / Domain */}
                    <div>
                        <Label htmlFor="industry">Industry / Domain</Label>
                        <Select value={industry} onValueChange={setIndustry}>
                            <SelectTrigger className="mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {industries.map((ind) => (
                                    <SelectItem
                                        key={ind.value}
                                        value={ind.value}
                                    >
                                        {ind.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="mt-1.5 text-sm text-gray-500">
                            Improves terminology translation accuracy for your
                            industry
                        </p>
                    </div>

                    {/* Audio Source */}
                    <div>
                        <Label>Audio Source (Select one or more)</Label>
                        <div className="mt-3 space-y-3">
                            {audioSourceOptions.map((source) => (
                                <div
                                    key={source.value}
                                    onClick={() =>
                                        toggleAudioSource(source.value)
                                    }
                                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                                        audioSources.includes(source.value)
                                            ? 'border-[#490aad] bg-[#F7F6FF]'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                                                audioSources.includes(
                                                    source.value,
                                                )
                                                    ? 'border-[#490aad] bg-[#490aad]'
                                                    : 'border-gray-300'
                                            }`}
                                        >
                                            {audioSources.includes(
                                                source.value,
                                            ) && (
                                                <svg
                                                    className="h-3 w-3 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={3}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {source.label}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {source.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-6">
                        <Button
                            onClick={handleStart}
                            disabled={!canStartMeeting}
                            className="flex-1 border-0 bg-gradient-to-r from-[#490aad] to-[#a171ff] text-white hover:from-[#5a1bc0] hover:to-[#b185ff]"
                        >
                            <Mic className="mr-2 h-4 w-4" />
                            Start Recording
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/dashboard')}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-[#D0C9FF] bg-gradient-to-br from-[#F7F6FF] to-[#EAE7FF] p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#490aad]">
                        <Settings className="h-4 w-4" />
                        <span className="text-sm font-medium">
                            Real-time Transcription
                        </span>
                    </div>
                    <p className="text-xs text-gray-700">
                        See your conversation transcribed in real-time as you
                        speak
                    </p>
                </div>

                <div className="rounded-lg border border-[#D0C9FF] bg-gradient-to-br from-[#F7F6FF] to-[#EAE7FF] p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#490aad]">
                        <Settings className="h-4 w-4" />
                        <span className="text-sm font-medium">AI Insights</span>
                    </div>
                    <p className="text-xs text-gray-700">
                        Automatic detection of tasks, decisions, and key points
                    </p>
                </div>

                <div className="rounded-lg border border-[#D0C9FF] bg-gradient-to-br from-[#F7F6FF] to-[#EAE7FF] p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#490aad]">
                        <Settings className="h-4 w-4" />
                        <span className="text-sm font-medium">
                            Instant Summary
                        </span>
                    </div>
                    <p className="text-xs text-gray-700">
                        Get meeting minutes and summary as soon as you finish
                    </p>
                </div>
            </div>
        </div>
    );
}
