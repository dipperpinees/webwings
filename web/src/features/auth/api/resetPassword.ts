export async function sendRequestPasswordRequest(email: string, state: string) {
    const response = await fetch("/api/user/reset-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            state,
            email,
        }),
    });
    if (!response.ok) {
        throw new Error("Send reset password mail failed")
    }
    return await response.json();
}

export interface IResetPasswordParams {
    user: string;
    password: string;
    code: string;
}

export async function resetPassword({user, password, code}: IResetPasswordParams) {
    const response = await fetch("/api/user/reset-password", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user,
            code,
            password,
        }),
    });
    if (!response.ok) {
        throw new Error("Reset password mail failed")
    }
    return await response.json();
}