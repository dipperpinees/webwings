import { Inject, Service } from "typedi";
import { StaticCaddy } from "../caddy";
import { Project } from "../project";
import { Config } from "@/config";
import { IStaticDeployment } from "@/types";
import { Docker } from "../docker";
import path from "path";

@Service()
export class WebDeployment {
    constructor(
        @Inject() private readonly caddy: StaticCaddy,
        @Inject() private readonly project: Project,
        @Inject() private readonly config: Config,
        @Inject() private readonly docker: Docker
    ) {}

    async start(deployment: IStaticDeployment, cb: (log: string) => void) {
        cb("Clone repo");
        const gitUrl = `https://${deployment.oauth.username}:${deployment.oauth.access_token}@github.com/${deployment.oauth.username}/${deployment.repo}.git`;
        await this.project.clone(deployment.id, gitUrl, cb);
        cb("Clone repo successfully");

        // const workDir = path.join(this.config.projectPath, deployment.id)

        // cb("Build image");
        // await this.docker.buildImage(workDir, deployment.id, "latest", cb);
        // await this.docker.pushImage(deployment.id, "latest");
    }
}