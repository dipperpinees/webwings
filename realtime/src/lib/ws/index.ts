import http from "http";
import { Server } from "socket.io";
import authenticate from "./authenticate";
import k8sLogger from "../kubectl/logger";

const intervalMap = new Map();

export default function wsHandler(server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });
    
    io.use(authenticate);

    io.on('connection', (socket) => {
        console.log(socket.id);
        socket.on('join_event', (msg: string) => {
            socket.join("event_" + msg);
        });

        socket.on('join_logs', (msg: string) => {
            socket.join("logs_" + msg);
            let latestTime: string;
            k8sLogger.getLog(msg, 10).then(data => {
                socket.emit("logs", data.map((item) => ({
                    time: item.time,
                    message: item.log,
                    type: "INFO"
                })))

                latestTime = data[data.length - 1].time;

                const interval = setInterval(() => {
                    console.log("interval")
                    k8sLogger.getLog(msg, 5, latestTime).then(data => {
                        socket.emit("logs", data.map((item) => ({
                            time: item.time,
                            message: item.log,
                            type: "INFO"
                        })))
                        if (data.length) {
                            latestTime = data[data.length - 1].time;
                        }
                    })
                }, 5000)
                intervalMap.set(socket.id, interval);
            })
        });

        socket.on("out_logs", (msg: string) => {
            socket.leave("logs_" + msg);
            clearInterval(intervalMap.get(socket.id))
        })

        socket.on("disconnect", () => {
            clearInterval(intervalMap.get(socket.id))
        })
    });

    return io;
}