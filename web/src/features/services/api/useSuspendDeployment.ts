import authFetch from "@/utils/auth-fetch";
import { useMutation } from "react-query";

const suspendDeployment = (deploymentID: string) => {
    return authFetch(`/deployment/suspend/${deploymentID}`, {
        method: "POST",
    });
}

export function useSuspendDeployment() {
    return useMutation(suspendDeployment);
}