import { Service } from 'typedi';
import util from 'node:util';
import { ExecOptions, SpawnOptions, exec, spawn } from 'node:child_process';

@Service()
export default class Cmd {
    exec(command: string, options: ExecOptions = {}) {
        return util.promisify(exec)(command, options);
    }

    spawnSync(command: string, args: string[], options: SpawnOptions = {}, cb: (data: string) => void) {
        const chillProcess = spawn(command, args, options);
        return new Promise((resolve, reject) => {
            chillProcess.on('error', function (err) {
                reject(err);
            });
            chillProcess.on('close', (code) => {
                resolve(code);
            });
            chillProcess!.stdout!.on('data', (data) => {
                cb(`${data}`);
            });

            chillProcess!.stderr!.on('data', (data) => {
                cb(`${data}`);
            });
        });
    }
}
