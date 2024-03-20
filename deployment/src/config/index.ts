import path from "path";
import { Service } from 'typedi';

@Service()
export class Config {
    caddyPath: string;
    amqpUri: string;
    constructor() {
        this.caddyPath = path.resolve("caddy");

        if (!process.env.AMQP_URI) {
            throw new Error("Environment AMQP_URI is undefined")
        }
        this.amqpUri = process.env.AMQP_URI;
    }
    
}