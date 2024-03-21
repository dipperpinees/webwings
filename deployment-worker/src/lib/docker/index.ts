import { Inject, Service } from 'typedi';
import Dockerode from 'dockerode';
import Cmd from '../cmd';
import { Config } from '@/config';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import path from 'path';

@Service()
export class Docker {
    service: Dockerode;
    nodeDockerfileTemplate: string;

    constructor(@Inject() private readonly config: Config, @Inject() private readonly cmd: Cmd) {
        this.service = new Dockerode({ socketPath: '/var/run/docker.sock' });
        this.nodeDockerfileTemplate = readFileSync(path.join(__dirname, './templates', 'node.Dockerfile'), {
            encoding: 'utf8',
        });
    }

    async buildImage(dir: string, imageName: string, tag: string = 'latest', onProgress: (log: string) => void) {
        // const stream = await this.service.buildImage(
        //     {
        //         context: dir,
        //         src: ['Dockerfile'],
        //     },
        //     { t: `${imageName}:${tag}`, buildargs: {} }
        // );

        // await new Promise((resolve, reject) => {
        //     this.service.modem.followProgress(
        //         stream,
        //         (err, res) => (err ? reject(err) : resolve(res)),
        //         onProgress && ((log) => {
        //             if (log.stream) onProgress(log.stream);
        //             if (log.error) reject(new Error(log.error));
        //         })
        //     );
        // });
        await this.cmd.spawnSync("docker", ["build", "-t", `${imageName}:${tag}`, dir], {}, onProgress)
    }

    async pushImage(imageName: string, tag: string = 'latest', cb: (log: string) => void) {
        await this.cmd.exec(`docker tag ${imageName}:${tag} ${this.config.dockerRegistryUser}/${imageName}:${tag}`);
        await this.cmd.spawnSync(`docker` , ["push", `${this.config.dockerRegistryUser}/${imageName}:${tag}`], {}, cb);
    }

    private convertCommandToArray(command: string) {
        return `[${command
            .split(/\s+/)
            .map((word) => `"${word}"`)
            .join(',')}]`;
    }

    createDockfile(_path: string, runtimeName: string, tag: string, buildCommand: string, startCommand: string) {
        let dockerFile = '';
        switch (runtimeName) {
            case 'Node':
                dockerFile = this.nodeDockerfileTemplate
                    .replace('<image>', `node:${tag}`)
                    .replace('<build_command>', buildCommand)
                    .replace('<start_command>', this.convertCommandToArray(startCommand));
                break;
        }
        const dockerFilePath = path.join(_path, 'Dockerfile');
        if (existsSync(dockerFilePath)) unlinkSync(dockerFilePath);
        writeFileSync(dockerFilePath, dockerFile);
    }
}
