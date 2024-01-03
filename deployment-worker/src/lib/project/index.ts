import { Config } from '@/config';
import { Inject, Service } from 'typedi';
import Cmd from '../cmd';
import { existsSync } from 'fs';
import path from 'path';

@Service()
export class Project {
    constructor(
        @Inject() private readonly config: Config,
        @Inject() private readonly cmd: Cmd
    ) {}

    clone(id: string, url: string) {
        return this.cmd.exec(`git clone ${url} ${id}`, {cwd: this.config.projectPath})
    }

    isExist(id: string) {
        return existsSync(path.join(this.config.projectPath, id));
    }

    pull(id: string) {
        return this.cmd.exec(`git pull`, {cwd: path.join(this.config.projectPath, id)})
    }

    switchBranch(id: string, branch: string) {
        const cwd = path.join(this.config.projectPath, id);
        return this.cmd.exec(`git fetch origin`, {cwd}).then(() => {
            return this.cmd.exec(`git checkout ${branch}`, {cwd})
        })
    }

    reset(id: string, hashCommit: string = "") {
        return this.cmd.exec(`git reset --hard ${hashCommit}`, {cwd: path.join(this.config.projectPath, id)})
    }
}