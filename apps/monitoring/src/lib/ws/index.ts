import http from 'http';
import { Server } from 'socket.io';
import authenticate from './authenticate';
import k8sLogger from '../kubectl/logger';
import prisma from '@/prisma';
import orderBy from 'lodash.orderby';

const intervalMap = new Map();

export default function wsHandler(server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    io.use(authenticate);

    io.on('connection', (socket) => {
        socket.on('join_event', (msg: string) => {
            socket.join('event_' + msg);
        });

        socket.on('join_logs', async (msg: string) => {
            socket.join('logs_' + msg);
            let latestTime: string;
            const buildLogs = await prisma.logs.findMany({
                where: {
                    deployment_id: msg,
                },
                orderBy: {
                    created_at: 'desc',
                },
                take: 10,
            });
            k8sLogger.getLog(msg, 10).then((data: any) => {
                const firstLogs = [
                    ...buildLogs.map((item: any) => ({
                        time: item.created_at,
                        message: item.message,
                        type: 'INFO',
                    })),
                    ...data.map((item: any) => ({
                        time: new Date(item.time),
                        message: item.log,
                        type: 'INFO',
                    })),
                ];
                const sortedLogs = orderBy(firstLogs, ['time'], ['asc']);

                socket.emit('logs', sortedLogs);
                if (!data.length) return;

                latestTime = data[data.length - 1].time;

                const interval = setInterval(() => {
                    k8sLogger.getLog(msg, 5, latestTime).then((data) => {
                        if (data.length) {
                            socket.emit(
                                'logs',
                                data.map((item) => ({
                                    time: item.time,
                                    message: item.log,
                                    type: 'INFO',
                                }))
                            );
                            latestTime = data[data.length - 1].time;
                        }
                    });
                }, 5000);
                intervalMap.set(socket.id, interval);
            });
        });

        socket.on('out_logs', (msg: string) => {
            socket.leave('logs_' + msg);
            clearInterval(intervalMap.get(socket.id));
        });

        socket.on('disconnect', () => {
            clearInterval(intervalMap.get(socket.id));
        });
    });

    return io;
}
