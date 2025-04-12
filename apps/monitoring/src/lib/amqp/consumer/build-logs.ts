import { ILog } from "@/types/logs";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import amqp from "../connection";
import prisma from "@/prisma";

export default async function initBuildLogsConsumer(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    try {
        const conn = await amqp.getConn();
        const channel = await conn.createChannel();

        const QUEUE_NAME = 'BUILD_LOGS';

        await channel.assertQueue(QUEUE_NAME, {
            durable: false
        });
        channel.prefetch(1);
        await channel.consume(QUEUE_NAME, async (msg: any) => {
            if (msg) {
                try {
                    const data = JSON.parse(msg.content.toString()) as ILog;
                    io.to("logs_" + data.deployment_id).emit("logs", [data]);
                    await prisma.logs.create({
                        data: {
                            deployment_id: data.deployment_id,
                            type: data.type,
                            message: data.message,
                            created_at: new Date(data.time),
                            updated_at: new Date(data.time),
                        }
                    })
                } catch (err) {
                    console.error(`${err}`);
                }
            }
        }, {
            noAck: true,
        })
    } catch (err) {
        console.error(`${err}`);
    }
}