import authFetch from "@/utils/auth-fetch";
import { useMutation } from "react-query";

const forceDeploy = (deploymentID: string) => {
    return authFetch(`/deployment/force/${deploymentID}`, {
        method: "POST",
    });
}

export function useForceDeploy() {
    return useMutation(forceDeploy);
}