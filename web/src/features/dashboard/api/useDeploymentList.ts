import { IDeployment } from "@/features/services"
import authFetch from "@/utils/auth-fetch"
import { useQuery } from "react-query"

const getDeploymentList = () => {
    return authFetch<IDeployment[]>("/deployment", {
        method: "GET"
    })
}

export const useDeploymentList = () => {
    return useQuery({
        queryKey: ['deployments'],
        queryFn: getDeploymentList,
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        retry: false,
    })
}