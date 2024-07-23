import { Config } from "@/config";
import { SetOptions, createClient } from 'redis';
import { Inject, Service } from "typedi";

@Service()
export default class Redis {
    private client?: ReturnType<typeof createClient>
    constructor(@Inject() private readonly config: Config) {}

    private async getClient() {
        if (!this.client) {
            this.client = await createClient({
                url: this.config.redisUri
            }).connect();
        }
        return this.client;
    }

    async get(key: string) {
        const client = await this.getClient();
        return await client.get(key);
    }

    async set(key: string, value: any, options?: SetOptions) {
        const client = await this.getClient();
        return await client.set(key, value, options);
    }

    async del(key: string) {
        const client = await this.getClient();
        return await client.del(key);
    }
}