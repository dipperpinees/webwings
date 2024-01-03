import authFetch from '@/utils/auth-fetch';
import { useQuery } from 'react-query';
import { IUser } from '..';

const authenticate = () => {
    return authFetch<IUser>("/user/auth", {
        method: "GET"
    })
}

export const useAuth = () => {
    return useQuery({
        queryKey: ['auth'],
        queryFn: authenticate,
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        retry: false,
    })
};