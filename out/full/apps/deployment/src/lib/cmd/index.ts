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
            let errMessage = "";
            chillProcess.on('error', function (err) {
                reject(err);
            });
            chillProcess.on('close', (code) => {
                if (code === 0) {
                    resolve(code);
                } else {
                    reject(new Error(errMessage));
                }
            });
            chillProcess!.stdout!.on('data', (data) => {
                cb(`${data}`);
            });

            chillProcess!.stderr!.on('data', (data) => {
                errMessage += `${data}`;
                cb(`${data}`);
            });
        });
    }
}
