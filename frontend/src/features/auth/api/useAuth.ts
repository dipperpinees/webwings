import authFetch from '@/utils/authFetch';
import { useQuery } from 'react-query';
import User from '../types/user';

const authenticate = () => {
    return authFetch<User>("/user/auth", {
        method: "GET"
    })
}

const useAuth = () => {
    return useQuery({
        retry: 0,
        queryKey: ['auth'],
        queryFn: authenticate,
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchOnWindowFocus: false
    })
};

export default useAuth;