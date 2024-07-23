import { API_URL } from "@/configs";
import { useMutation, useQueryClient } from "react-query";
import { IAuthRepsonse, IUser } from "..";

const signUp = async ({email, password}: {email: string, password: string}): Promise<IAuthRepsonse> => {
    const response = await fetch(API_URL + "/user/sign-up", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    if (response.ok) {
        return await response.json()
    }
    if (response.status === 400) {
        const {message} = await response.json();
        throw new Error(message);
    }
    throw new Error(response.statusText)
}

export function useSignUp() {
    const queryClient = useQueryClient();

    return useMutation(signUp, {
        onSuccess: (data: IAuthRepsonse) => {
            localStorage.setItem("access-token", data.accessToken);
            queryClient.setQueryData<IUser | undefined>('auth', () => {
                const user: IUser = {
                    id: data.id,
                    email: data.email,
                    name: data.name,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt
                }
                return user;
            });
        }
    });
}