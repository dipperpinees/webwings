import { useMutation } from "react-query";
import { IDeployment } from "..";
import { API_URL } from "@/configs";
import authFetch from "@/utils/auth-fetch";

const createDeployment = (data: IDeployment) => {
    return authFetch<IDeployment>(API_URL + "/user/sign-in", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

export function useCreateDeployment() {
    return useMutation(createDeployment, {
        onSuccess: (data) => {
            
        }
    });
}