import { Inject, Service } from 'typedi';
import Dockerode from 'dockerode';
import Cmd from '../cmd';
import { Config } from '@/config';

@Service()
export class Docker {
    service: Dockerode;
    constructor(@Inject() private readonly config: Config, @Inject() private readonly cmd: Cmd) {
        this.service = new Dockerode({ socketPath: '/var/run/docker.sock' });
    }

    async buildImage(dir: string, imageName: string, tag: string = 'latest', onProgress?: (log: string) => void) {
        const stream = await this.service.buildImage(
            {
                context: dir,
                src: ['Dockerfile'],
            },
            { t: `${imageName}:${tag}` },
        );

        await new Promise((resolve, reject) => {
            this.service.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res), onProgress);
        });
    }

    async pushImage(imageName: string, tag: string = "latest") {
        await this.cmd.exec(`docker tag ${imageName}:${tag} ${this.config.dockerhubUser}/${imageName}:${tag}`);
        await this.cmd.exec(`docker push ${this.config.dockerhubUser}/${imageName}:${tag}`);
    }
}
