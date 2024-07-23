import authFetch from '@/utils/auth-fetch';
import { UseQueryOptions, useQuery } from 'react-query';
import { IBranch } from '..';

export const useBranchesList = ({username, repo}: {username?: string, repo?: string}, options: UseQueryOptions<IBranch[]> = {}) => {
    const getBranchesList = async (): Promise<IBranch[]> => {
        const data = await authFetch<IBranch[]>(`/repo/${username}/${repo}`, {
            method: "GET"
        })
        
        return data.reduce<IBranch[]>((previousValue, currentValue) => {
            if (currentValue.name === "main" || currentValue.name === "master") {
                return [currentValue, ...previousValue];
            }
            return [...previousValue, currentValue]
        }, [])
    }

    return useQuery({
        queryKey: ['branches', username, repo],
        queryFn: getBranchesList,
        staleTime: Infinity,
        cacheTime: Infinity,
        ...options
    })
};