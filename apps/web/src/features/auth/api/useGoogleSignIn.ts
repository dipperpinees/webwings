import { API_URL } from "@/configs";
import { TokenResponse } from "@react-oauth/google";
import { useMutation, useQueryClient } from "react-query";
import { IAuthRepsonse, IUser } from "../types";

const signInWithGoogle = async (ggUser: Omit<TokenResponse, "error" | "error_description" | "error_uri">): Promise<IAuthRepsonse> => {
    const data: IAuthRepsonse = await fetch(API_URL + "/user/sign-in/google", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(ggUser)
    }).then(response => response.json());
    return data;
}

export function useSignInGoogle() {
    const queryClient = useQueryClient();

    return useMutation(signInWithGoogle, {
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