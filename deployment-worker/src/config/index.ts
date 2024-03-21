import path from "path";
import { Service } from 'typedi';

@Service()
export class Config {
    caddyPath: string ;
    projectPath: string;
    amqpUri: string;
    dockerRegistryUser: string;
    constructor() {
        this.caddyPath = path.resolve("caddy");
        this.projectPath = path.resolve("projects");

        if (!process.env.AMQP_URI) {
            throw new Error("Environment AMQP_URI is undefined")
        }
        this.amqpUri = process.env.AMQP_URI;
        this.dockerRegistryUser = process.env.DOCKER_REGISTRY_USER as string;
    }
    
}