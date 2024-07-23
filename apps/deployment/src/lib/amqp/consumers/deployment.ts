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
                console.log("🚀 ~ DeploymentConsumer ~ return ~ data:", data)
                this.webDeployment.start(data, console.log);
            } catch (error: any) {
                console.error(error);
            }
        };
    }

    private suspendDeployment(channel: Channel) {
        return async (msg: ConsumeMessage | null) => {
            if (!msg) return;
            try {
                const {deploymentID} = JSON.parse(msg.content.toString()) as {deploymentID: string};
                await this.webDeployment.suspend(deploymentID);
            } catch (error: any) {
                console.error(error);
            }
        };
    }

    private deleteDeployment(channel: Channel) {
        return async (msg: ConsumeMessage | null) => {
            if (!msg) return;
            try {
                const {deploymentID} = JSON.parse(msg.content.toString()) as {deploymentID: string};
                await this.webDeployment.delete(deploymentID);
            } catch (error: any) {
                console.error(error);
            }
        };
    }

    async initCreateDeploymentQueue(channel: Channel) {
        const QUEUE_NAME = 'DEPLOYMENT';
        await channel.assertQueue(QUEUE_NAME, {
            durable: true,
        });

        channel.consume(QUEUE_NAME, this.handleDeployment(channel), {
            noAck: true,
        });
    }

    async initSuspendDeploymentQueue(channel: Channel) {
        const QUEUE_NAME = 'SUSPEND_DEPLOYMENT';
        await channel.assertQueue(QUEUE_NAME, {
            durable: true,
        });

        channel.consume(QUEUE_NAME, this.suspendDeployment(channel), {
            noAck: true,
        });
    }

    async initDeleteDeploymentQueue(channel: Channel) {
        const QUEUE_NAME = 'DELETE_DEPLOYMENT';
        await channel.assertQueue(QUEUE_NAME, {
            durable: true,
        });

        channel.consume(QUEUE_NAME, this.deleteDeployment(channel), {
            noAck: true,
        });
    }

    async init() {
        const channel = await this.amqp.createChannel();
        await this.initCreateDeploymentQueue(channel);
        await this.initSuspendDeploymentQueue(channel);
        await this.initDeleteDeploymentQueue(channel);
    }
}
