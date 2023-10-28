import { API_URL } from "@/configs";

async function fetchUnauthorizedHandler<T>(request: () => Promise<Response>) {
    if (!localStorage.getItem("refresh-token")) throw new Error("Unauthorized");
    const response = await fetch(`${API_URL}/user/refresh-access-token`, {
        method: "GET",
        headers: {
            "Authorization": `${localStorage.getItem("refresh-token")}`
        }
    });
    if (response.ok) {
        const { accessToken } = await response.json();
        localStorage.setItem("access-token", accessToken);
        const _response = await request();
        if (_response.ok) {
            return await _response.json() as T;
        }
        if (response.status === 400) {
            const message = await response.json();
            throw new Error(message.error);
        }
        throw new Error(response.statusText);
    }
    throw new Error("Unauthorized");
}

export default async function authFetch<T>(input: RequestInfo | URL, init?: RequestInit | undefined) {
    const request = () => {
        return fetch(`${API_URL}${input}`, {
            ...init,
            headers: {
                ...init?.headers,
                "Authorization": `${localStorage.getItem("access-token")}`
            }
        });
    }
    const response = await request();
    if (response.ok) {
        return await response.json() as T;
    } 
    if (response.status === 401) return fetchUnauthorizedHandler<T>(request);
    if (response.status === 400) {
        const message = await response.json();
        throw new Error(message.error);
    }
    throw new Error(response.statusText);    
}