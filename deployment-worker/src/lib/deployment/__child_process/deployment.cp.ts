import 'module-alias/register';
import 'reflect-metadata';
import { Config } from "@/config";
import { StaticCaddy } from "@/lib/caddy";
import { Docker } from "@/lib/docker";
import Kubectl from '@/lib/kubectl';
import { Project } from "@/lib/project";
import { IDeployment, TEnvironmentVariables } from "@/types";
import { existsSync, unlinkSync } from "fs";
import path from "path";
import Container, { Inject, Service } from "typedi";
import { parentPort } from 'worker_threads';

@Service()
class WebDeployment {
    constructor(
        @Inject() private readonly caddy: StaticCaddy,
        @Inject() private readonly project: Project,
        @Inject() private readonly config: Config,
        @Inject() private readonly docker: Docker,
        @Inject() private readonly kubectl: Kubectl,
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
    }

    private getEnvConfig(env: string): TEnvironmentVariables {
        try {
            return JSON.parse(env) as TEnvironmentVariables;
        } catch (err) {
            return []
        }
    }
    
    async commonDeploy(deployment: IDeployment, cb: (log: string) => void) {
        this.docker.createDockfile(
            this.getWorkdir(deployment),
            deployment.runtime.runtime_name,
            deployment.runtime.tag,
            deployment.build_command,
            deployment.start_command,
            deployment.root
        )
        cb("Create Dockfile successfully");

        await this.docker.buildImage(this.getWorkdir(deployment), deployment.id, "latest", cb, this.getEnvConfig(deployment.env));
        cb("Build image successfully");

        await this.docker.pushImage(deployment.id, "latest", cb);
        cb("Push image to Docker registry successfully");

        this.kubectl.createDeployment(deployment.id, `${this.config.dockerRegistryUser}/${deployment.id}:latest`, cb);
        cb("Create deployment successfully");
    }

    async firstDeploy(deployment: IDeployment, cb: (log: string) => void) {
        cb("Clone repo");
        const gitUrl = this.getGitURL(deployment);
        await this.project.clone(deployment.id, gitUrl, deployment.branch, cb);
        cb("Clone repo successfully");

        await this.commonDeploy(deployment, cb);
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

        await this.commonDeploy(deployment, cb);
    }

    async cleanWork(deployment: IDeployment) {
        if (existsSync(this.getWorkdir(deployment))) {
            unlinkSync(this.getWorkdir(deployment))
        }

        return this.docker.deleteImage(deployment.id, "latest")
        .then(() => {
            return this.docker.deleteImage(`${this.config.dockerRegistryUser}/${deployment.id}`, "latest")
        }).catch(err => {})
    }
}

const logMessageHandler = (log: string) => {
    parentPort?.postMessage({type: "logs", message: log})
}

parentPort?.postMessage({type: "pid", message: process.pid})

const webDeployment = Container.get(WebDeployment);
parentPort?.on('message', ({type, message}: {type: string, message: IDeployment}) => {
    switch(type) {
        case "start":
            webDeployment.start(message, logMessageHandler);
            break;
        default:
    }
});