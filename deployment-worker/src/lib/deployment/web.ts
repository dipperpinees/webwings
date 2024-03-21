import { Config } from "@/config";
import { IDeployment } from "@/types";
import { Inject, Service } from "typedi";
import { StaticCaddy } from "../caddy";
import { Docker } from "../docker";
import { Project } from "../project";
import path from "path";

@Service()
export class WebDeployment {
    constructor(
        @Inject() private readonly caddy: StaticCaddy,
        @Inject() private readonly project: Project,
        @Inject() private readonly config: Config,
        @Inject() private readonly docker: Docker
    ) {}

    private getGitURL(deployment: IDeployment) {
        return `https://${deployment.oauth.username}:${deployment.oauth.access_token}@github.com/${deployment.oauth.username}/${deployment.repo}.git`;
    }

    private getWorkdir(deployment: IDeployment) {
        return path.join(this.config.projectPath, deployment.id)
    }

    async start(deployment: IDeployment, cb: (log: string) => void) {
        if (this.project.isExist(deployment.id)) {
            await this.freeDeploy(deployment, cb)
        } else {
            await this.firstDeploy(deployment, cb);
        }

        // const workDir = path.join(this.config.projectPath, deployment.id)

        // cb("Build image");
        // await this.docker.buildImage(workDir, deployment.id, "latest", cb);
        // await this.docker.pushImage(deployment.id, "latest");
    }

    async firstDeploy(deployment: IDeployment, cb: (log: string) => void) {
        cb("Clone repo");
        const gitUrl = this.getGitURL(deployment);
        await this.project.clone(deployment.id, deployment.branch, gitUrl, cb);
        cb("Clone repo successfully");

        this.docker.createDockfile(
            this.getWorkdir(deployment),
            deployment.runtime.runtime_name,
            deployment.runtime.tag,
            deployment.build_command,
            deployment.start_command
        )
        cb("Create Dockfile successfully");

        await this.docker.buildImage(this.getWorkdir(deployment), deployment.id, "latest", cb);
        cb("Build image successfully");

        await this.docker.pushImage(deployment.id, "latest", cb);
        cb("Push image to Dockerhub successfully");
    }

    async freeDeploy(deployment: IDeployment, cb: (log: string) => void) {
        cb("Update repo");

        await this.project.switchBranch(deployment.id, deployment.branch);
        cb("Switch branch successfully");

        await this.project.pull(deployment.id)
        cb("Pull repository successfully");

        if (deployment.commit !== "latest") {
            await this.project.hardReset(deployment.id, deployment.commit);
            cb("Reset commit successfully");
        }

        this.docker.createDockfile(
            path.join(this.config.projectPath, deployment.id),
            deployment.runtime.runtime_name,
            deployment.runtime.tag,
            deployment.build_command,
            deployment.start_command
        )
        cb("Create Dockfile successfully");

        await this.docker.buildImage(this.getWorkdir(deployment), deployment.id, "latest", cb);
        cb("Build image successfully");

        await this.docker.pushImage(deployment.id, "latest", cb);
        cb("Push image to Dockerhub successfully");
    }
}