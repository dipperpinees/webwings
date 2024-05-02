import 'module-alias/register';
import 'reflect-metadata';
import { Config } from "@/config";
import { Docker } from "@/lib/docker";
import Kubectl from '@/lib/kubectl';
import { Project } from "@/lib/project";
import { IDeployment, TEnvironmentVariables } from "@/types";
import { existsSync } from "fs";
import path from "path";
import Container, { Inject, Service } from "typedi";
import Cloudflare from '@/lib/cloudflare';

@Service()
class WebDeployment {
    constructor(
        @Inject() private readonly project: Project,
        @Inject() private readonly config: Config,
        @Inject() private readonly docker: Docker,
        @Inject() private readonly kubectl: Kubectl,
        @Inject() private readonly cloudflare: Cloudflare
    ) {}

    private getGitURL(deployment: IDeployment) {
        return `https://${deployment.oauth.username}:${deployment.oauth.access_token}@github.com/${deployment.oauth.username}/${deployment.repo}.git`;
    }

    private getWorkdir(deployment: IDeployment) {
        return path.join(this.config.projectPath, deployment.id)
    }

    async start(deployment: IDeployment, cb: (log: string) => void) {
        await this.startDeploy(deployment, cb);
    }

    private getEnvConfig(env: string): TEnvironmentVariables {
        try {
            return JSON.parse(env) as TEnvironmentVariables;
        } catch (err) {
            return []
        }
    }

    private getShortCommitHash(deployment: IDeployment) {
        return deployment.commit?.slice(0, 7);
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

        const SHORT_COMMIT_HASH = this.getShortCommitHash(deployment);
        await this.docker.buildImage(this.getWorkdir(deployment), deployment.id, SHORT_COMMIT_HASH, cb, this.getEnvConfig(deployment.env));
        cb("Build image successfully");

        await this.docker.pushImage(deployment.id, SHORT_COMMIT_HASH, cb);
        cb("Push image to Docker registry successfully");

        const externalIP = await this.kubectl.start(deployment.id, this.getEnvConfig(deployment.env),`${this.config.dockerRegistryUser}/${deployment.id}:${SHORT_COMMIT_HASH}`, cb);

        await this.cloudflare.createDNSRecord(deployment.domain, externalIP);
        cb("Create DNS record successfully");
        cb(`Create deployment successfully with ${externalIP}`);
    }

    async startDeploy(deployment: IDeployment, cb: (log: string) => void) {
        try {
            await this.cleanWork(deployment);
            const WORK_DIR = this.getWorkdir(deployment);
            if (existsSync(WORK_DIR)) {
                cb("Checkout branch");
                await this.project.switchBranch(deployment.id, deployment.branch);
                await this.project.pull(deployment.id);
            } else {
                cb("Clone repo");
                const gitUrl = this.getGitURL(deployment);
                await this.project.clone(deployment.id, gitUrl, deployment.branch, cb);
            }

            if (deployment.commit) {
                await this.project.hardReset(deployment.id, deployment.commit)
            }

            cb("Clone repo successfully");

            await this.commonDeploy(deployment, cb);
        } catch (error: any) {
            console.log(error.message)
            await this.cleanWork(deployment);
            throw error;
        }
    }

    async cleanWork(deployment: IDeployment) {
        const SHORT_COMMIT_HASH = this.getShortCommitHash(deployment);
        try {
            await this.docker.deleteImage(deployment.id, SHORT_COMMIT_HASH)
            await this.docker.deleteImage(`${this.config.dockerRegistryUser}/${deployment.id}`, SHORT_COMMIT_HASH);
            // await this.kubectl.deleteService("service-" + deployment.id);
            // await this.kubectl.deleteDeployment(deployment.id);
            // await this.kubectl.deleteAutoscaleDeployment(deployment.id);
        } catch (err) {}
    }
}

const webDeployment = Container.get(WebDeployment);
const inputData = JSON.parse(process.argv[2]) as IDeployment;
webDeployment.start(inputData, console.log);