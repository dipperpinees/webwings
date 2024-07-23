import { API_URL } from "@/configs";
import { useMutation, useQueryClient } from "react-query";
import authFetch from "@/utils/auth-fetch";
import { UserUpdated } from "../types";
import { IUser } from "@/features/auth";

interface Props {
    id: string;
    data: UserUpdated;
}

export function useUpdateUser() {
    const queryClient = useQueryClient();

    const updateUser = async ({id, data}: Props) => {
        await authFetch(`${API_URL}/user/${id}`, {
            method: "POST",
            body: JSON.stringify(data)
        })
        return data;
    }

    return useMutation(updateUser, {
        onSuccess: (data) => {
            localStorage.removeItem("access-token");
            localStorage.removeItem("refresh-token");
            queryClient.setQueryData<IUser | undefined>('auth', (oldData) => {
                if (!oldData) return;
                oldData!.name = data.name;
                return {...oldData}
            });
        }
    });
}