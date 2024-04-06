import prisma from "@/prisma";
import amqp from "../connection";
import { Prisma } from "@prisma/client";

export default async function initConsumer() {
    try {
        const conn = await amqp.getConn();
        const channel = await conn.createChannel();

        const QUEUE_NAME = 'EVENT';

        await channel.assertQueue(QUEUE_NAME, {
            durable: false
        });

        await channel.consume(QUEUE_NAME, async (msg) => {
            if (msg) {
                try {
                    const data = JSON.parse(msg.content.toString()) as Prisma.eventsCreateInput;
                    await prisma.events.create({
                        data
                    })
                } catch (err) {
                    console.error(err);
                }
                channel.ack(msg);
            }
            
        })
    } catch (err) {
        console.error('Error::', err)
    }
}