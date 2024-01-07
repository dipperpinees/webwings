import authFetch from "@/utils/auth-fetch";
import { useMutation } from "react-query";
import { IDeployment } from "..";

const createDeployment = (data: IDeployment) => {
    return authFetch<IDeployment>("/deployment", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

export function useCreateDeployment() {
    return useMutation(createDeployment);
}