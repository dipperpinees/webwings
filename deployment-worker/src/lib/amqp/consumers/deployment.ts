import { WebDeployment } from '@/lib/deployment';
import { IDeployment } from '@/types';
import { Channel, ConsumeMessage } from 'amqplib';
import { Inject, Service } from 'typedi';
import Amqp from '../amqp';

@Service()
export class DeploymentConsumer {
    constructor(@Inject() private readonly amqp: Amqp, @Inject() private readonly webDeployment: WebDeployment) {}

    private handleDeployment(channel: Channel) {
        return async (msg: ConsumeMessage | null) => {
            if (!msg) return;
            try {
                const data = JSON.parse(msg.content.toString()) as IDeployment;
                this.webDeployment.start(data, console.log);
            } catch (error: any) {
                console.error(error);
            }
        };
    }

    async init() {
        const channel = await this.amqp.createChannel();
        const QUEUE_NAME = 'DEPLOYMENT';
        await channel.assertQueue(QUEUE_NAME, {
            durable: true,
        });

        channel.consume(QUEUE_NAME, this.handleDeployment(channel), {
            noAck: true,
        });
    }
}
