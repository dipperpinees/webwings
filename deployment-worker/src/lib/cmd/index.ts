import { Service } from "typedi";
import util from 'node:util';
import childProcess from "node:child_process";

@Service()
export default class Cmd {
    
    exec(command: string, options?: childProcess.ExecOptions) {
        return util.promisify(childProcess.exec)(command, options)
    }
}