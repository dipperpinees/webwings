import { Inject, Service } from 'typedi';
import Amqp from '../amqp';
import { StaticDeployment } from '@/lib/deployment';
import { ConsumerMessageHandler } from '@/utils/consumer-handler';
import { IStaticDeployment } from '@/types';
import { Channel, ConsumeMessage } from 'amqplib';

@Service()
export class DeploymentConsumer {
    constructor(@Inject() private readonly amqp: Amqp, @Inject() private readonly staticDeployment: StaticDeployment) {}

    private handleDeployment(channel: Channel) {
        return async (msg: ConsumeMessage | null) => {
            if (!msg) return;
            try {
                const data = JSON.parse(msg.content.toString()) as IStaticDeployment;
                await this.staticDeployment.start(data, () => {});
                channel.ack(msg);
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
            noAck: false,
        });
    }
}
