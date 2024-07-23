import path from "path";
import { Service } from 'typedi';

@Service()
export class Config {
    caddyPath: string ;
    projectPath: string;
    amqpUri: string;
    dockerRegistryUser: string;
    redisUri: string;
    cfZoneID: string;
    cfAPIKey: string;
    mainDomain: string;

    constructor() {
        this.caddyPath = path.resolve("caddy");
        this.projectPath = path.resolve("projects");

        if (!process.env.AMQP_URI) {
            throw new Error("Environment AMQP_URI is undefined")
        }
        this.amqpUri = process.env.AMQP_URI as string;
        this.dockerRegistryUser = process.env.DOCKER_REGISTRY_USER as string;
        this.redisUri = process.env.REDIS_URL as string;
        this.cfZoneID = process.env.CLOUDFLARE_ZONE_ID as string;
        this.cfAPIKey = process.env.CLOUDFLARE_API_KEY as string;
        this.mainDomain = process.env.MAIN_DOMAIN as string;
    }
    
}