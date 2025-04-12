import { Config } from '@/config';
import amqp from 'amqplib';
import { Inject, Service } from 'typedi';

@Service()
export default class Amqp {
    connection?: amqp.ChannelModel;
    constructor(
        @Inject() private readonly config: Config,
    ) {}

    init() {
        if (this.connection) return this.connection;
        return amqp.connect(this.config.amqpUri).then((connection) => {
            this.connection = connection;
            return connection;
        })
    }

    async createChannel() {
        const connection = await this.init();
        return connection.createChannel();
    }
}
