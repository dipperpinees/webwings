import authFetch from '@/utils/authFetch';
import { UseQueryOptions, useQuery } from 'react-query';
import { GithubRepo } from '../types/Repositories';

const useRepositoriesList = (configs: UseQueryOptions<GithubRepo[]> = {}) => {
    const getRepositoriesList = async (): Promise<GithubRepo[]>=> {
        const data = await authFetch<GithubRepo[]>(`/repo`, {
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