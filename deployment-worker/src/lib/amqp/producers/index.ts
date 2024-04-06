import { IEvent } from '@/types';
import { Inject, Service } from 'typedi';
import amqp from '../amqp';
import Amqp from '../amqp';

@Service()
export class Producer {
    constructor(@Inject() private readonly amqp: Amqp) {}

    async sendEvent(event: IEvent) {
        const channel = await this.amqp.createChannel();
        const QUEUE_NAME = 'EVENT';
        await channel.assertQueue(QUEUE_NAME, {
            durable: false,
        });

        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(event)))
    }
}
