import authFetch from '@/utils/auth-fetch';
import { useQuery } from 'react-query';
import { IOAuth } from '..';

const getOAuthData = () => {
    return authFetch<IOAuth[]>("/user/oauth", {
        method: "GET"
    })
}

const useOAuth = () => {
    return useQuery({
        queryKey: ['oauth'],
        queryFn: getOAuthData,
        staleTime: Infinity,
        cacheTime: Infinity
    })
};

export default useOAuth;