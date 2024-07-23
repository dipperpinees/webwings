import authFetch from "@/utils/auth-fetch";
import { useMutation, useQueryClient } from "react-query";
import { ICreateDeployment, IDeployment } from "..";

const createDeployment = (data: ICreateDeployment) => {
    return authFetch<IDeployment>("/deployment", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

export function useCreateDeployment() {
    const queryClient = useQueryClient();
    return useMutation(createDeployment, {
        onSuccess: () => {
            queryClient.removeQueries(["deployments"])
        }
    });
}