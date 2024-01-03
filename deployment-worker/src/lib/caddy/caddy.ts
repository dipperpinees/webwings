import { Config } from "@/config";
import Cmd from "../cmd";

export interface INewCaddyConfig {
    id: string;
    domain: string;
    folderPath: string
}

export default class Caddy {
    constructor(
        readonly config: Config,
        readonly cmd: Cmd
    ) {}

    new(params: INewCaddyConfig) {}

    delete(id: string) {}

    reload() {
        return this.cmd.exec('caddy reload', { cwd: this.config.caddyPath })
    }
}