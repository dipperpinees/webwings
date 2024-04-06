import { TEnvironmentVariables } from "@/types";
import { existsSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
import { Inject, Service } from "typedi";
import Cmd from "../cmd";

@Service()
export default class K8sDeployment {
    private configDir: string = path.join(__dirname, "./config");
    constructor(@Inject() private readonly cmd: Cmd) {}

    private createConfig(deploymentName: string, image: string, env: TEnvironmentVariables) {
        const deploymentFilename = deploymentName + ".json";
        const deploymentFilepath = path.join(this.configDir, deploymentFilename);
        const deploymentConfig = {
            "apiVersion": "apps/v1",
            "kind": "Deployment",
            "metadata": {
                "name": deploymentName
            },
            "spec": {
                "selector": {
                    "matchLabels": {
                        "app": deploymentName
                    }
                },
                "template": {
                    "metadata": {
                        "labels": {
                            "app": deploymentName
                        }
                    },
                    "spec": {
                        "containers": [
                            {
                                "name": deploymentName,
                                "image": image,
                                "env": [
                                    ...env.map(({key, value}) => {
                                        return {
                                            name: key,
                                            value
                                        }
                                    }),
                                    {
                                        name: "PORT",
                                        value: "8000"
                                    },
                                ]
                            }
                        ],
                        "imagePullSecrets": [{
                            "name": "registrypullsecret"
                        }]
                    }
                }
            }
        }
        if (existsSync(deploymentFilepath)) unlinkSync(deploymentFilepath);
        writeFileSync(deploymentFilepath, JSON.stringify(deploymentConfig));

        return deploymentFilename;
    }

    async create(deploymentName: string, image: string, env: TEnvironmentVariables, cb: (log: string) => void) {
        const configFilename = this.createConfig(deploymentName, image, env);

        await this.cmd.spawnSync(`/bin/bash`, ["-c", `kubectl apply -f ${configFilename}`], {
            cwd: this.configDir,
        }, cb)
    }

    async getDeployments(deploymentName: string) {
        const { stdout } = await this.cmd.exec(`/bin/bash -c "kubectl get deployment ${deploymentName} --ignore-not-found"`);
        const _stdout = stdout.trim();
        if (!_stdout) return;
        
        const logArr = _stdout.split(/(\s+)/).filter(str => !!str.trim());
        return {
            "NAME": logArr[5],
            "READY": logArr[6],
            'UP-TO-DATE': Number(logArr[7]),
            'AVAILABLE': Number(logArr[8]),
            'AGE': logArr[9]
        }
    }

    async createAutoscaleDeployment(deploymentName: string, cb: (log: string) => void) {
        await this.cmd.spawnSync(`/bin/bash`, ["-c", `kubectl autoscale deployment ${deploymentName} --cpu-percent=80 --min=1 --max=5`], {}, cb)
    }

    async deleteAutoscaleDeployment(hpaName: string) {
        await this.cmd.exec(`/bin/bash -c "kubectl delete hpa ${hpaName} --ignore-not-found"`);
    }

    async deleteDeployment(deploymentName: string) {
        await this.cmd.exec(`/bin/bash -c "kubectl delete deployment ${deploymentName} --ignore-not-found"`);
        await this.cmd.exec(`/bin/bash -c "kubectl delete --all pods --namespace=${deploymentName}"`);
    }

    async getPendingPodOfDeploymentStatus(deploymentName: string) {
        return new Promise((resolve, reject) => {
            const FIVE_MINUTES = 5 * 60 * 1000;
            let timeout: NodeJS.Timeout
            let interval: NodeJS.Timeout;

            const clear = () => {
                clearInterval(interval);
                clearTimeout(timeout);
            }

            timeout = setTimeout(() => {
                clear();
                reject(new Error("Timeout when get deployment status"));
            }, FIVE_MINUTES)

            interval = setInterval(async () => {
                const status = await this.getPodOfDeploymentStatus(deploymentName);
                if (status === "Running") {
                    clear();
                    resolve(1);
                    return;
                }
                if (status === "Error" || status === "Failed" || status === "CrashLoopBackOff") {
                    clear();
                    reject(new Error("Failed to create deployment"))
                }
            }, 1000)
        })
    }

    async getPodOfDeploymentStatus(deploymentName: string) {
        const {stdout} = await this.cmd.exec(`/bin/bash -c "kubectl get pods -l app=${deploymentName}"`);
        const _stdout = stdout.trim();
        const logArr = _stdout.split(/(\s+)/).filter(str => !!str.trim());
        return logArr[7];
    }
}