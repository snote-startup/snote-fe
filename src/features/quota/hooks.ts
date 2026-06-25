import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQuota, buyQuota } from './api';

export const quotaKeys = {
    all: ['quota'] as const,
};

export function useQuota() {
    return useQuery({
        queryKey: quotaKeys.all,
        queryFn: getQuota,
    });
}

export function useBuyQuota() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: buyQuota,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: quotaKeys.all });
        },
    });
}
