export type QuotaInfo = {
    plan?: string;
    tier?: string;
    projectsUsed?: number;
    projectsLimit?: number;
    remainingProjects?: number;
    raw: unknown;
};
