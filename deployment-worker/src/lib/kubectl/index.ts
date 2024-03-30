import { Inject, Service } from "typedi";
import Cmd from "../cmd";
import path from "path";
import { existsSync, unlinkSync, writeFileSync } from "fs";

@Service()
export default class Kubectl {
    private configDir: string = path.join(__dirname, "./config");
    constructor(@Inject() private readonly cmd: Cmd) {}

    createDeployment(deploymentName: string, image: string) {
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
                                "imagePullPolicy": true
                            }
                        ],
                        "imagePullSecrets": {
                            "name": "registrypullsecret"
                        }
                    }
                }
            }
        }
        if (existsSync(deploymentFilepath)) unlinkSync(deploymentFilepath);
        writeFileSync(deploymentFilepath, JSON.stringify(deploymentConfig));
    }
}