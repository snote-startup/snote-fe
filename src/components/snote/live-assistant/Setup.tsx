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
import { Settings, AlertCircle, Plus, Loader2 } from 'lucide-react';
import { useApp } from '@/providers/snote-app-provider';
import { useCreateProject } from '@/features/projects/hooks';
import { toast } from 'sonner';

export function LiveAssistantSetup() {
    const router = useRouter();
    const { user } = useApp();
    const [title, setTitle] = useState('');
    const [inputLanguage, setInputLanguage] = useState('english');
    const [outputLanguage, setOutputLanguage] = useState('english');
    const [industry, setIndustry] = useState('general');
    const [audioSources, setAudioSources] = useState<string[]>(['microphone']);

    const createMutation = useCreateProject();
    const [createError, setCreateError] = useState<string | null>(null);

    const minutesRemaining = user
        ? user.subscription.minutesLimit - user.subscription.minutesUsed
        : 0;
    const canStartMeeting = minutesRemaining > 0;

    const handleStart = () => {
        if (!canStartMeeting) {
            router.push('/pricing');
            return;
        }

        const projectTitle =
            title.trim() ||
            `Meeting Session - ${new Date().toLocaleDateString()}`;
        const generatedDescription = `Input Language: ${inputLanguage} | Output Translation: ${outputLanguage} | Domain/Industry: ${industry} | Audio Sources: ${audioSources.join(', ')}`;

        setCreateError(null);
        createMutation.mutate(
            {
                title: projectTitle,
                description: generatedDescription,
            },
            {
                onSuccess: (projectId) => {
                    toast.success('Meeting project created successfully');
                    router.push(`/meetings/${projectId}`);
                },
                onError: (err) => {
                    setCreateError(
                        err.message || 'Failed to create meeting project',
                    );
                    toast.error(err.message || 'Failed to create project');
                },
            },
        );
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
                <h1 className="text-foreground mb-2 text-3xl font-semibold">
                    Create Meeting Project
                </h1>
                <p className="text-muted-foreground">
                    Set up a project now. Audio upload and transcript processing
                    live inside each project.
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
            <div className="border-border bg-card rounded-xl border p-8">
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
                        <p className="text-muted-foreground mt-1.5 text-sm">
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
                            <p className="text-muted-foreground mt-1.5 text-sm">
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
                            <p className="text-muted-foreground mt-1.5 text-sm">
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
                        <p className="text-muted-foreground mt-1.5 text-sm">
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
                                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                                        audioSources.includes(source.value)
                                            ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                            : 'border-border hover:border-primary/50 bg-card'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-5 w-5 items-center justify-center rounded border ${
                                                audioSources.includes(
                                                    source.value,
                                                )
                                                    ? 'border-primary bg-primary'
                                                    : 'border-border'
                                            }`}
                                        >
                                            {audioSources.includes(
                                                source.value,
                                            ) && (
                                                <svg
                                                    className="text-primary-foreground h-3 w-3"
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
                                            <p className="text-foreground font-medium">
                                                {source.label}
                                            </p>
                                            <p className="text-muted-foreground text-sm">
                                                {source.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {createError && (
                        <div className="text-destructive bg-destructive/10 mt-4 flex items-start gap-2 rounded-lg p-3 text-sm">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{createError}</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-6">
                        <Button
                            onClick={handleStart}
                            disabled={
                                !canStartMeeting || createMutation.isPending
                            }
                            className="flex-1 border-0 bg-gradient-to-r from-[#490aad] to-[#a171ff] text-white hover:from-[#5a1bc0] hover:to-[#b185ff]"
                        >
                            {createMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="mr-2 h-4 w-4" />
                            )}
                            {createMutation.isPending
                                ? 'Creating Project...'
                                : 'Create Project'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/dashboard')}
                            disabled={createMutation.isPending}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="border-border bg-card rounded-lg border p-4">
                    <div className="text-primary mb-2 flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span className="text-foreground text-sm font-medium">
                            Real-time Transcription
                        </span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                        See your conversation transcribed in real-time as you
                        speak
                    </p>
                </div>

                <div className="border-border bg-card rounded-lg border p-4">
                    <div className="text-primary mb-2 flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span className="text-foreground text-sm font-medium">
                            AI Insights
                        </span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                        Automatic detection of tasks, decisions, and key points
                    </p>
                </div>

                <div className="border-border bg-card rounded-lg border p-4">
                    <div className="text-primary mb-2 flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span className="text-foreground text-sm font-medium">
                            Instant Summary
                        </span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                        Get meeting minutes and summary as soon as you finish
                    </p>
                </div>
            </div>
        </div>
    );
}
