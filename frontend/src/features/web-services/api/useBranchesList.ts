import authFetch from '@/utils/authFetch';
import { useQuery } from 'react-query';
import Branch from '../types/Branch';

const useBranchesList = ({username, repo}: {username: string, repo: string}) => {
    const getBranchesList = async (): Promise<Branch[]> => {
        const data = await authFetch<Branch[]>(`/repo/${username}/${repo}`, {
            method: "GET"
        })
        
        return data.reduce<Branch[]>((previousValue, currentValue) => {
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
    })
};

export default useBranchesList;