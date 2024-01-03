import { API_URL } from "@/configs";
import { useMutation, useQueryClient } from "react-query";
import { IUser } from "..";

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

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation(logOut, {
        onSuccess: () => {
            localStorage.removeItem("access-token");
            localStorage.removeItem("refresh-token");
            queryClient.setQueryData<IUser | undefined>('auth', () => {
                return undefined;
            });
        }
    });
}