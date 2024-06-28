import prisma from "@/prisma";
import { EEvent, IEvent } from "@/types/event";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import amqp from "../connection";

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
                    const data = JSON.parse(msg.content.toString()) as IEvent;
                    if (!data.commit_msg || !data.commit_sha) {
                        const lastestEvent = await prisma.events.findMany({
                            where: {
                                deployment_id: data.deployment_id
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
                            deployment_id: data.deployment_id,
                            commit_msg: data.commit_msg,
                            commit_sha: data.commit_sha,
                            type: data.type,
                            auto_trigger: data.auto_trigger,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }
                    })
                    if (data.type === EEvent.DEPLOY_SUCCESS && data.external_ip) {
                        await prisma.deployments.update({
                            where: {
                                id: data.deployment_id
                            },
                            data: {
                                expose_ip: data.external_ip
                            }
                        })
                    }
                    io.to("event_" + newEvent.deployment_id).emit("event", newEvent);
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