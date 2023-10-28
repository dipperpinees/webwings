import { API_URL } from "@/configs";
import { useMutation, useQueryClient } from "react-query";
import User from "../types/user";

const logOut = async () => {
    const response = await fetch(`${API_URL}/user/sign-out`, {
        method: "POST",
        headers: {
            "Authorization": `${localStorage.getItem("refresh-token")}`
        }
    })
    if (!response.ok) {
        throw new Error(response.statusText)
    }
}

export default function useLogout() {
    const queryClient = useQueryClient();

    return useMutation(logOut, {
        onSuccess: () => {
            queryClient.setQueryData<User | undefined>('auth', () => {
                return undefined;
            });
        }
    });
}