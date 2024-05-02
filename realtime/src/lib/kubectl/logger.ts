import { exec } from "child_process";
import util from "util";

const execSync = util.promisify(exec);

class K8SLogger {
    async getLog(deploymentID: string, tail?: number, sinceTime?: string) {
        try {
            const { stdout } = await execSync(`/bin/bash -c "kubectl logs -l app=${deploymentID} ${tail ? `--tail=${tail}` : ""} --timestamps=true ${sinceTime ? `--since-time=${sinceTime}` : ""}"`);
            const logArr = stdout.split("\n").filter(log => !!log);
            if (sinceTime) logArr.shift();
            return logArr.map((log) => {
                return {
                    time: log.substring(0, log.indexOf(" ")),
                    log: log.substring(log.indexOf(" ") + 1)
                }
            })
        } catch (error) {
            return [];
        }
    }
}

const k8sLogger = Object.freeze(new K8SLogger());
export default k8sLogger;