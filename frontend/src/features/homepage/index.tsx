import { useEffect } from "react"

export default function HomePage() {
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/user/refresh-access-token`, {
            method: "POST",
            headers: {
                "Authorization": localStorage.getItem("refresh-token") || ""
            }
        })
    }, [])
    return <>
    </>
}