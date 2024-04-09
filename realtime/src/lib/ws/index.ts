import {Server} from "socket.io";
import http from "http";
import authenticate from "./authenticate";
import { ELogType } from "@/types/logs";

export default function wsHandler(server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });
    
    io.use(authenticate);

    io.on('connection', (socket) => {
        socket.on('join_event', (msg: string) => {
            socket.join("event_" + msg);
        });

        socket.on('join_logs', (msg: string) => {
            socket.join("logs_" + msg);
        });
    });

    return io;
}