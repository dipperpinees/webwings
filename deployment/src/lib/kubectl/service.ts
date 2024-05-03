import { Inject, Service } from "typedi";
import Cmd from "../cmd";

@Service()
export default class K8sService {
    constructor(@Inject() private readonly cmd: Cmd) {}

    async createExposeService(deploymentName: string, cb: (log: string) => void) {
        await this.cmd.spawnSync(`/bin/bash`, ["-c", `kubectl expose deployment ${deploymentName} --name=service-${deploymentName} --type=LoadBalancer --port 80 --target-port 8000`], {}, cb)
        cb("Create expose service successfully");
    }

    getPendingServiceExternalIP(deploymentName: string) {
        return new Promise<string>((resolve, reject) => {
            const FIVE_MINUTES = 5 * 60 * 1000;
            const timeout = setTimeout(() => {
                reject(new Error("Timeout when getting service's external ip"));
            }, FIVE_MINUTES)

            const interval = setInterval(async () => {
                const externalIP = await this.getServiceExternalIP("service-" + deploymentName);
               
                if (externalIP) {
                    clearTimeout(timeout);
                    clearInterval(interval);
                    resolve(externalIP)
                }
            }, 3000)
        })
    }

    async getServiceExternalIP(serviceName: string) {
        const { stdout } = await this.cmd.exec(`/bin/bash -c "kubectl get service ${serviceName} --ignore-not-found -o=jsonpath='{.status.loadBalancer.ingress[0].ip}'"`);
        return stdout.trim();
    }

    async deleteService(serviceName: string) {
        await this.cmd.exec(`/bin/bash -c "kubectl delete service ${serviceName} --ignore-not-found"`);
    }
}