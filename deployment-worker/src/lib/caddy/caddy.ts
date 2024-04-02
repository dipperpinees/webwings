import { Config } from "@/config";
import Cmd from "../cmd";
import { Service } from "typedi";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import path from "path";

export interface INewCaddyConfig {
    id: string;
    domain: string;
    folderPath: string
}

@Service()
export default class Caddy {
    constructor(
        readonly config: Config,
        readonly cmd: Cmd
    ) {}

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

    reload() {
        return this.cmd.exec('caddy reload', { cwd: this.config.caddyPath })
    }
}