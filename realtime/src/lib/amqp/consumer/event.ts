import prisma from "@/prisma";
import amqp from "../connection";
import { Prisma } from "@prisma/client";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default async function initEventConsumer(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    try {
        const conn = await amqp.getConn();
        const channel = await conn.createChannel();

        const QUEUE_NAME = 'EVENT';

        await channel.assertQueue(QUEUE_NAME, {
            durable: true
        });

        await channel.consume(QUEUE_NAME, async (msg) => {
            if (msg) {
                try {
                    const data = JSON.parse(msg.content.toString()) as Prisma.eventsCreateInput;
                    if (!data.commit_msg || !data.commit_sha) {
                        const lastestEvent = await prisma.events.findMany({
                            where: {
                                deployment_id: data.id
                            },
                            orderBy: {
                                created_at: 'desc',
                            },
                            take: 1,
                        });
                        data.commit_msg = lastestEvent?.[0].commit_msg;
                        data.commit_sha = lastestEvent?.[0].commit_sha;
                    }
                    const newEvent = await prisma.events.create({
                        data: {
                            ...data,
                            id: undefined,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }
                    })
                    io.to("event_" + newEvent.deployment_id).emit("event", newEvent);
                } catch (err) {
                    console.error(err);
                }
            }

        }, {
            noAck: true,
        })
    } catch (err) {
        console.error('Error::', err)
    }
}