import { Config } from '@/config';
import Cmd from '@/lib/cmd';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import path from 'path';
import { Inject, Service } from 'typedi';
import Caddy, { INewCaddyConfig } from './caddy';

@Service()
export default class StaticCaddy extends Caddy {
    constructor(
        @Inject() readonly config: Config,
        @Inject() readonly cmd: Cmd
    ) {
        super(config, cmd)
    }

    new({ id, domain, folderPath }: INewCaddyConfig) {
        const template = readFileSync(path.join(__dirname, './templates/file-server.txt'), { encoding: 'utf8' });
        const caddyfileContent = template.replace('{{DOMAIN}}', domain).replace('{{PATH}}', folderPath);
        writeFileSync(path.join(this.config.caddyPath, `./static/${id}.caddyfile`), caddyfileContent);
        this.reload();
    }

    delete(id: string) {
        const filePath = path.join(this.config.caddyPath, `${id}.caddyfile`);
        if (existsSync(filePath)) unlinkSync(filePath);
        this.reload();
    }
}
