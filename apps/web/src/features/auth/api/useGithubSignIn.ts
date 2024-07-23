import { API_URL } from "@/configs";
import { useMutation, useQueryClient } from "react-query";
import { IAuthRepsonse, IUser } from "..";

const signInGithub = async (code: string): Promise<IAuthRepsonse> => {
    const data: IAuthRepsonse = await fetch(API_URL + "/user/sign-in/github?code=" + code, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
    }).then(response => response.json());
    return data;
}

export function useSignInGithub() {
    const queryClient = useQueryClient();

    return useMutation(signInGithub, {
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