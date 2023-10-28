import authFetch from '@/utils/authFetch';
import { useQuery } from 'react-query';
import OAuth from '../../web-services/types/OAuth';

const getOAuthData = () => {
    return authFetch<OAuth[]>("/user/oauth", {
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