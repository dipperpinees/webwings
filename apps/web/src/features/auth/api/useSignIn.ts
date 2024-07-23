import { API_URL } from "@/configs";
import { useMutation, useQueryClient } from "react-query";
import { IAuthRepsonse, IUser } from "..";

const signIn = async ({email, password}: {email: string, password: string}): Promise<IAuthRepsonse> => {
    const data: IAuthRepsonse = await fetch(API_URL + "/user/sign-in", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ email, password })
    }).then(response => response.json());
    return data;
}

export function useSignIn() {
    const queryClient = useQueryClient();

    return useMutation(signIn, {
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