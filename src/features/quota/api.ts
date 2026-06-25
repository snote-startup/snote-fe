import { apiClient } from '@/lib/api/axios-config';
import type { QuotaInfo } from './types';

/**
 * GET /quota
 * Fetch user's current project quota limit.
 * Tolerant parsing as specified by requirements.
 */
export async function getQuota(): Promise<QuotaInfo> {
    const response = await apiClient.get('/quota');
    const data = response;

    let projectsLimit = 5; // default fallback
    if (typeof data === 'number') {
        projectsLimit = data;
    } else if (typeof data === 'string') {
        const parsed = parseInt(data, 10);
        if (!isNaN(parsed)) projectsLimit = parsed;
    } else if (data && typeof data === 'object') {
        // try to get from common property names
        const anyData = data as unknown as Record<string, unknown>;
        const limitVal =
            anyData.limit ??
            anyData.max ??
            anyData.quota ??
            anyData.project_limit ??
            anyData.projectsLimit ??
            anyData.projects_limit;
        if (typeof limitVal === 'number') {
            projectsLimit = limitVal;
        } else if (typeof limitVal === 'string') {
            const parsed = parseInt(limitVal, 10);
            if (!isNaN(parsed)) projectsLimit = parsed;
        }
    }

    return {
        projectsLimit,
        raw: data,
    };
}

/**
 * POST /quota/buy
 * Request a payment URL. Expects plain text link as return value.
 */
export async function buyQuota(): Promise<string> {
    const response = await apiClient.post('/quota/buy', null, {
        headers: {
            Accept: 'text/plain, */*',
        },
        responseType: 'text',
    });
    return String(response).trim();
}
