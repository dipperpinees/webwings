import Dockerode from "dockerode";

export class DockerRemote {
    instance: Dockerode;
    constructor(host: string, port: number) {
        this.instance = new Dockerode({ host: `http://${host}`, port });
    }

    async pullImage(image: string) {
        const auth = {
            username: 'hiepnk',
            password: 'hiepnk223',
            serveraddress: 'https://docker-registry.hiepnk.id.vn'
        };
        await this.instance.pull(image, { 'authconfig': auth });
    }

    async deleteContainer(id: string) {
        await this.instance.getContainer(id).stop();
        await this.instance.getContainer(id).remove();
    }

    async runContainer(name: string, image: string) {
        const container = await this.instance.createContainer({
            name: name,
            Image: image,
            AttachStdin: false,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
            Cmd: ['/bin/bash'],
            OpenStdin: false,
            StdinOnce: false,
        })
        return container.id;
    }
}