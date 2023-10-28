import authFetch from '@/utils/authFetch';
import { UseQueryOptions, useQuery } from 'react-query';
import { Runtime } from '../types/Runtime';

const useRuntimesList = (configs: UseQueryOptions<Runtime[]> = {}) => {
    const getRuntimesList = async (): Promise<Runtime[]>=> {
        const data = await authFetch<Runtime[]>(`/runtimes`, {
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

export default useRuntimesList;