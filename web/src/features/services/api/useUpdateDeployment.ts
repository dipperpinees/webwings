import authFetch from "@/utils/auth-fetch";
import { useMutation, useQueryClient } from "react-query";
import { IDeployment, IUpdateDeployment } from "..";

const updateDeployment = (data: IUpdateDeployment) => {
    const {id, ...updateData} = data;
    return authFetch<IDeployment>(`/deployment/${data.id}`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(updateData)
    });
}

export function useUpdateDeployment() {
    const queryClient = useQueryClient();
    return useMutation(updateDeployment, {
        onSuccess: (data) => {
            queryClient.refetchQueries(["deployment", data.id])
        }
    });
}