import authFetch from '@/utils/auth-fetch';
import { UseQueryOptions, useQuery } from 'react-query';

export const useCurrentRuntime = (language?: string, options: UseQueryOptions<string> = {}) => {
    const getCurrentRuntime = async (): Promise<string> => {
        const data = await authFetch<{runtime: string}>(`/runtimes/${language}`, {
            method: "GET"
        })
        return data.runtime;
    }

    return useQuery({
        queryKey: ['runtime', language],
        queryFn: getCurrentRuntime,
        staleTime: Infinity,
        cacheTime: Infinity,
        ...options
    })
};
