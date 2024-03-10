import authFetch from '@/utils/auth-fetch';
import { UseQueryOptions, useQuery } from 'react-query';
import { IDeployment } from '..';

export const useDeployment = (id: string, options: UseQueryOptions<IDeployment> = {}) => {
    const getCurrentRuntime = async (): Promise<IDeployment> => {
        const data = await authFetch<IDeployment>(`/deployment/${id}`, {
            method: "GET"
        })
        return data;
    }

    return useQuery({
        queryKey: ['deployment', id],
        queryFn: getCurrentRuntime,
        staleTime: Infinity,
        cacheTime: Infinity,
        ...options
    })
};
