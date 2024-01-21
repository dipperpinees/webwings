import path from "path";
import { Service } from 'typedi';

@Service()
export class Config {
    caddyPath: string ;
    projectPath: string;
    amqpUri: string;
    constructor() {
        this.caddyPath = path.resolve("caddy");
        this.projectPath = path.resolve("projects");

        if (!process.env.AMQP_URI) {
            throw new Error("Environment AMQP_URI is undefined")
        }
        this.amqpUri = process.env.AMQP_URI;
    }
    
}