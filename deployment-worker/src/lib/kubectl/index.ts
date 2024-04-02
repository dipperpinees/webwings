import { TEnvironmentVariables } from "@/types";
import { Inject, Service } from "typedi";
import K8sDeployment from "./deployment";
import K8sService from "./service";

@Service()
export default class Kubectl {
    constructor(
        @Inject() private readonly k8sDeployment: K8sDeployment,
        @Inject() private readonly k8sService: K8sService
    ) { }

    async start(deploymentName: string, env: TEnvironmentVariables, image: string, cb: (log: string) => void) {
        const isExistDeployment = await this.k8sDeployment.getDeployments(deploymentName);
        await this.k8sDeployment.create(deploymentName, image, env, cb);

        if (!isExistDeployment) {
            await this.k8sDeployment.createAutoscaleDeployment(deploymentName, cb);
        }

        await this.k8sDeployment.getPendingPodOfDeploymentStatus(deploymentName);
        let externalIP = await this.k8sService.getServiceExternalIP("service-" + deploymentName);
        if (!externalIP) {
            await this.k8sService.createExposeService(deploymentName, cb);
            const externalIP = await this.k8sService.getPendingServiceExternalIP(deploymentName);
            return externalIP;
        }
        return externalIP;
    }

}