import { WS_URI } from "@/configs";
import { useAuth } from "@/features/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

type Socket = ReturnType<typeof io>
const WSContext = createContext<Socket | undefined>(undefined);

type AppProviderProps = {
    children: React.ReactNode;
};

export function useSocket() {
    const socket = useContext(WSContext);
    return socket;
}

export default function WSProvider({ children }: AppProviderProps) {
    const [socket, setSocket] = useState<Socket | undefined>();
    const {data: user} = useAuth();

    useEffect(() => {
        if (!user) return;
        const _socket = io(WS_URI, {
            query: {token: localStorage.getItem("access-token")}
        });
        _socket.on('connect', () => {
            setSocket(_socket)
        });
        return () => {
            _socket.disconnect();
        }
    }, [user])

    return <WSContext.Provider value={socket}>
        {children}
    </WSContext.Provider>;
}