import authFetch from "@/utils/auth-fetch";
import { useMutation, useQueryClient } from "react-query";

const deleteDeployment = (deploymentID: string) => {
    return authFetch(`/deployment/${deploymentID}`, {
        method: "DELETE",
    });
}

export function useDeleteDeployment() {
    const queryClient = useQueryClient();
    return useMutation(deleteDeployment, {
        onSuccess: () => {
            queryClient.removeQueries(["deployments"])
        }
    });
}