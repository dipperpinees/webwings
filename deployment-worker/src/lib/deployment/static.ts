import { Inject, Service } from "typedi";
import { StaticCaddy } from "../caddy";
import { Project } from "../project";
import { Config } from "@/config";
import { IStaticDeployment } from "@/types";

@Service()
export class StaticDeployment {
    constructor(
        @Inject() private readonly caddy: StaticCaddy,
        @Inject() private readonly project: Project,
        @Inject() private readonly config: Config
    ) {}

    async start(deployment: IStaticDeployment, cb: (log: string) => void) {
        cb("Clone repo");
        const cloneCmd = `https://${deployment.oauth.username}:${deployment.oauth.access_token}@github.com/${deployment.oauth.username}/${deployment.repo}.git`;
        await this.project.clone(deployment.id, cloneCmd, cb);
        cb("Clone repo successfully");

        // this.caddy.new({id: deployment.id, domain: ""})
        
    }
}