import authFetch from '@/utils/auth-fetch';
import { UseQueryOptions, useQuery } from 'react-query';
import { IGithubRepo } from '../types/Repositories';

const useRepositoriesList = (configs: UseQueryOptions<IGithubRepo[]> = {}) => {
    const getRepositoriesList = async (): Promise<IGithubRepo[]>=> {
        const data = await authFetch<IGithubRepo[]>(`/repo`, {
            method: "GET"
        })
        
        return data;
    }

    return useQuery({
        queryKey: ['repositories'],
        queryFn: getRepositoriesList,
        staleTime: Infinity,
        cacheTime: Infinity,
        ...configs
    })
};

export default useRepositoriesList;