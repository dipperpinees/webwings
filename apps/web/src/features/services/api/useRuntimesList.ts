import authFetch from '@/utils/auth-fetch';
import { UseQueryOptions, useQuery } from 'react-query';
import { IRuntime } from '..';

export const useRuntimesList = (configs: UseQueryOptions<IRuntime[]> = {}) => {
    const getRuntimesList = async (): Promise<IRuntime[]>=> {
        const data = await authFetch<IRuntime[]>(`/runtimes`, {
            method: "GET"
        })
        
        return data;
    }

    return useQuery({
        queryKey: ['runtimes'],
        queryFn: getRuntimesList,
        staleTime: Infinity,
        cacheTime: Infinity,
        ...configs
    })
};