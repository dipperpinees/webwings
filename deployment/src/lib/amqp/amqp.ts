import { Config } from '@/config';
import amqp from 'amqplib';
import { Inject, Service } from 'typedi';

@Service()
export default class Amqp {
    connection?: amqp.Connection;
    constructor(@Inject() private readonly config: Config) {}

    init() {
        if (this.connection) return this.connection;
        return amqp.connect(this.config.amqpUri).then((connection) => {
            console.log("AMQP connect successfully")
            this.connection = connection;
            return connection;
        })
    }

    async createChannel() {
        const connection = await this.init();
        return connection.createChannel();
    }
}
