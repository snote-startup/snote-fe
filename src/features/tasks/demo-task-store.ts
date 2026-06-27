import type { ProjectTask, TaskPriority, TaskStatus } from './types';

export const DEMO_TASK_STORAGE_KEY = 'snote.demo.tasks.v1';

export type DemoTask = ProjectTask & {
    projectId: string;
    title: string;
    description?: string;
    createdAt: string;
};

type StoredDemoTasks = Record<string, DemoTask[]>;

const ACTION_VERBS = [
    'Review',
    'Prepare',
    'Summarize',
    'Validate',
    'Document',
    'Follow up',
];

const FALLBACK_TASKS: Array<{
    title: string;
    description: string;
    priority: TaskPriority;
}> = [
    {
        title: 'Summarize meeting transcript',
        description:
            'Create a concise summary of the main points discussed in the transcript.',
        priority: 'medium',
    },
    {
        title: 'Prepare follow-up checklist',
        description:
            'List follow-up actions, owners, and validation points from the meeting.',
        priority: 'medium',
    },
    {
        title: 'Review key discussion points',
        description:
            'Check the transcript for important decisions, blockers, and next steps.',
        priority: 'low',
    },
];

const SAMPLELIB_TASKS: Array<{
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
}> = [
    {
        title: 'Review SampleLib supported file formats',
        description:
            'Summarize the image formats mentioned in the transcript and their use cases.',
        priority: 'high',
        status: 'todo',
    },
    {
        title: 'Prepare upload validation checklist',
        description:
            'Create a QA checklist for validating sample file upload and media playback.',
        priority: 'high',
        status: 'todo',
    },
    {
        title: 'Compare image format trade-offs',
        description:
            'Document strengths and trade-offs of JPEG, PNG, SVG, GIF, and WebP/Web formats.',
        priority: 'medium',
        status: 'todo',
    },
    {
        title: 'Create demo notes for SampleLib workflow',
        description:
            'Turn the transcript into a short demo script for explaining SampleLib.',
        priority: 'medium',
        status: 'in_progress',
    },
    {
        title: 'Identify reusable test assets',
        description:
            'List which sample files can be reused for developer testing and QA workflows.',
        priority: 'low',
        status: 'todo',
    },
];

function canUseStorage() {
    return typeof window !== 'undefined' && !!window.localStorage;
}

function readStore(): StoredDemoTasks {
    if (!canUseStorage()) return {};

    try {
        const raw = window.localStorage.getItem(DEMO_TASK_STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

function writeStore(store: StoredDemoTasks) {
    if (!canUseStorage()) return;
    window.localStorage.setItem(DEMO_TASK_STORAGE_KEY, JSON.stringify(store));
}

function hashText(value: string) {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash).toString(36);
}

function normalizeText(value: string) {
    return value.replace(/\s+/g, ' ').trim();
}

function splitSentences(value: string) {
    return normalizeText(value)
        .split(/(?<=[.!?])\s+|\n+/)
        .map((sentence) =>
            sentence
                .replace(/^\[[^\]]+\]\s*/, '')
                .replace(/^[\w\s-]{1,32}:\s*/, '')
                .trim(),
        )
        .filter(Boolean);
}

function compactTitle(sentence: string, verb: string) {
    const cleaned = sentence
        .replace(/[^\w\s-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const words = cleaned.split(' ').filter(Boolean).slice(0, 8);
    const phrase = words.join(' ').toLowerCase();
    return phrase ? `${verb} ${phrase}` : `${verb} meeting action item`;
}

function getPriority(sentence: string, index: number): TaskPriority {
    if (
        /\b(must|important|essential|validate|check|required|critical)\b/i.test(
            sentence,
        )
    ) {
        return 'high';
    }
    return index % 3 === 2 ? 'low' : 'medium';
}

function buildTask(
    projectId: string,
    title: string,
    description: string,
    priority: TaskPriority,
    status: TaskStatus,
    createdAt: string,
    index: number,
    transcriptText: string,
): DemoTask {
    const id = `demo-task-${projectId}-${index}-${hashText(
        `${title}:${transcriptText}`,
    )}`;

    return {
        id,
        projectId,
        title,
        description,
        content: title,
        status,
        priority,
        createdAt,
        created_at: createdAt,
    };
}

export function getDemoTasks(projectId: string): DemoTask[] {
    return readStore()[projectId] ?? [];
}

export function setDemoTasks(projectId: string, tasks: DemoTask[]) {
    const store = readStore();
    store[projectId] = tasks;
    writeStore(store);
}

export function clearDemoTasks(projectId: string) {
    const store = readStore();
    delete store[projectId];
    writeStore(store);
}

export function generateDemoTasksFromTranscript(
    projectId: string,
    transcriptText: string,
): DemoTask[] {
    const normalized = normalizeText(transcriptText);
    const createdAt = new Date().toISOString();
    const isSampleLibTranscript =
        /sampleli[bd]\.com/i.test(normalized) ||
        (/samplelib/i.test(normalized) &&
            /\b(jpeg|png|svg|gif|webp|web)\b/i.test(normalized));

    if (isSampleLibTranscript) {
        return SAMPLELIB_TASKS.map((task, index) =>
            buildTask(
                projectId,
                task.title,
                task.description,
                task.priority,
                task.status,
                createdAt,
                index,
                normalized,
            ),
        );
    }

    const sentences = splitSentences(normalized);
    const substantialSentences = sentences.filter(
        (sentence) => sentence.length >= 40,
    );
    const selectedSentences = (
        substantialSentences.length >= 2
            ? substantialSentences
            : sentences.filter((sentence) => sentence.length >= 15)
    ).slice(0, 6);

    if (normalized.length < 80 || selectedSentences.length < 2) {
        return FALLBACK_TASKS.map((task, index) =>
            buildTask(
                projectId,
                task.title,
                task.description,
                task.priority,
                index === 1 ? 'in_progress' : 'todo',
                createdAt,
                index,
                normalized,
            ),
        );
    }

    return selectedSentences
        .slice(0, Math.max(4, selectedSentences.length))
        .map((sentence, index) => {
            const verb = ACTION_VERBS[index % ACTION_VERBS.length];
            return buildTask(
                projectId,
                compactTitle(sentence, verb),
                `Follow up on this transcript point: ${sentence}`,
                getPriority(sentence, index),
                index === 1 ? 'in_progress' : 'todo',
                createdAt,
                index,
                normalized,
            );
        });
}
