import { Config } from "@/config";
import { Inject, Service } from "typedi";

@Service()
export default class Cloudflare {
    private API_ENDPOINT: string;
    constructor(@Inject() private readonly config: Config) {
        this.API_ENDPOINT = `https://api.cloudflare.com/client/v4/zones/${config.cfZoneID}`;
    }

    async createDNSRecord(subdomain: string, ip: string) {
        const response = await fetch(this.API_ENDPOINT + "/dns_records", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.config.cfAPIKey}`
            },
            body: JSON.stringify({
                "type": "A",
                "name": subdomain + "." + this.config.mainDomain,
                "content": ip,
                "proxied": true
            })
        })

        if (response.status !== 200 && response.status !== 400) {
            throw new Error(response.statusText);
        }

        const {success, errors} = await response.json();
        if (!success) {
            if (errors[0].code !== 81057) {
                throw new Error(errors[0].message);
            }
        }
    }
}