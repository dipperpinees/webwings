import { Config } from '@/config';
import { Inject, Service } from 'typedi';
import Cmd from '../cmd';
import { existsSync, mkdir, mkdirSync } from 'fs';
import path from 'path';

@Service()
export class Project {
    constructor(@Inject() private readonly config: Config, @Inject() private readonly cmd: Cmd) {}

    clone(id: string, url: string, cb: (log: string) => void) {
        const dir = path.join(this.config.projectPath, id);
        if (!existsSync(dir)) mkdirSync(dir);
        return this.cmd.spawnSync('git', ['clone', url, "src"], { cwd: dir }, cb);
    }

    isExist(id: string) {
        return existsSync(path.join(this.config.projectPath, id));
    }

    pull(id: string) {
        return this.cmd.exec(`git pull`, { cwd: path.join(this.config.projectPath, id) });
    }

    switchBranch(id: string, branch: string) {
        const cwd = path.join(this.config.projectPath, id);
        this.cmd.exec(`git fetch origin`, { cwd });
        this.cmd.exec(`git checkout ${branch}`, { cwd });
    }

    reset(id: string, hashCommit: string = '') {
        return this.cmd.exec(`git reset --hard ${hashCommit}`, { cwd: path.join(this.config.projectPath, id) });
    }
}
