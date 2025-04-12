import { Config } from '@/config';
import { TEnvironmentVariables } from '@/types';
import Dockerode from 'dockerode';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { Inject, Service } from 'typedi';
import Cmd from '../cmd';

@Service()
export class Docker {
    service: Dockerode;
    nodeDockerfileTemplate: string;
    goDockerfileTemplate: string;
    pythonDockerfileTemplate: string;

    constructor(@Inject() private readonly config: Config, @Inject() private readonly cmd: Cmd) {
        this.service = new Dockerode({ socketPath: '/var/run/docker.sock' });
        this.nodeDockerfileTemplate = readFileSync(path.join(__dirname, './templates', 'node.Dockerfile'), {
            encoding: 'utf8',
        });
        this.goDockerfileTemplate = readFileSync(path.join(__dirname, './templates', 'go.Dockerfile'), {
            encoding: 'utf8',
        });
        this.pythonDockerfileTemplate = readFileSync(path.join(__dirname, './templates', 'python.Dockerfile'), {
            encoding: 'utf8',
        });
    }

    private getRuntimeEnv(env: TEnvironmentVariables) {
        return env.reduce<string[]>((pre, cur) => {
            pre.push("--build-arg", `${cur.key}=${cur.value}`);
            return pre;
        }, [])
    }

    async buildImage(dir: string, imageName: string, tag: string = 'latest', onProgress: (log: string) => void, env: TEnvironmentVariables) {
        await this.cmd.spawnSync("docker", ["build", "-t", `${imageName}:${tag}`, dir, ...this.getRuntimeEnv(env)], {}, onProgress)
    }

    async pushImage(imageName: string, tag: string = 'latest', cb: (log: string) => void) {
        await this.cmd.exec(`docker tag ${imageName}:${tag} ${this.config.dockerRegistryUser}/${imageName}:${tag}`);
        await this.cmd.spawnSync(`docker`, ["push", `${this.config.dockerRegistryUser}/${imageName}:${tag}`], {}, cb);
    }

    private convertCommandToArray(command: string) {
        return `[${command
            .split(/\s+/)
            .map((word) => `"${word}"`)
            .join(',')}]`;
    }

    createDockfile(_path: string, runtimeName: string, tag: string, buildCommand: string, startCommand: string, workdir: string) {
        let dockerFile = '';
        switch (runtimeName) {
            case 'Node':
                dockerFile = this.nodeDockerfileTemplate
                    .replace('<image>', `node:${tag}`)
                    .replace('<build_command>', buildCommand ? `RUN ${buildCommand}` : "")
                    .replace('<start_command>', this.convertCommandToArray(startCommand))
                    .replace('<workdir>', workdir ? `/${workdir}` : "")
                break;
            case 'Go':
                dockerFile = this.goDockerfileTemplate
                    .replace('<image>', `golang:${tag}`)
                    .replace('<build_command>', buildCommand ? `RUN ${buildCommand}` : "")
                    .replace('<start_command>', this.convertCommandToArray(startCommand))
                    .replace('<workdir>', workdir ? `/${workdir}` : "")
                break;
            case 'Python':
            case 'Python3':
                dockerFile = this.pythonDockerfileTemplate
                    .replace('<image>', `python:${tag}`)
                    .replace('<build_command>', buildCommand ? `RUN ${buildCommand}` : "")
                    .replace('<start_command>', this.convertCommandToArray(startCommand))
                    .replace('<workdir>', workdir ? `/${workdir}` : "")
                break;
            default:
        }
        const dockerFilePath = path.join(_path, 'Dockerfile');
        writeFileSync(dockerFilePath, dockerFile);
    }

    async deleteImage(repository: string, tag: string) {
        await this.cmd.exec(`docker image rm ${repository}:${tag} -f`)
    }
}
