import { EEvent, ELogType, IDeployment } from "@/types";
import path from "node:path";
import { Worker, WorkerOptions } from "node:worker_threads";
import { Inject, Service } from "typedi";
import Redis from "../redis";
import { Producer } from "../amqp/producers";
import kill from "tree-kill";
import { spawn } from "node:child_process";

@Service()
export class WebDeployment {
    constructor(
        @Inject() private readonly redis: Redis,
        @Inject() private readonly producer: Producer
    ) {}
    async start(deployment: IDeployment, cb: (log: string) => void) {
        const previousPid = await this.redis.get(deployment.id + "_pid");
        if (previousPid) {
            try {
                kill(parseInt(previousPid));
            } catch (err) {}
        }
        const childProcess = spawn("npx", ["ts-node", path.join(__dirname, "./__child_process/deployment.worker.ts"), JSON.stringify(deployment)], {
            env: process.env
        })
        this.redis.set(deployment.id + "_pid", childProcess.pid, {
            EX: 10 * 60
        });
        childProcess.stdout.on('data', (data) => {
            cb(`${data}`.trim());
            this.producer.sendBuildLog({
                time: new Date(),
                message: `${data}`.trim(),
                type: ELogType.INFO,
                deployment_id: deployment.id
            })
        });
        childProcess.stderr.on('data', (data) => {
            cb(`${data}`.trim());
            this.producer.sendBuildLog({
                time: new Date(),
                message: `${data}`.trim(),
                type: ELogType.ERROR,
                deployment_id: deployment.id
            })
        });
        childProcess.on('close', async (code) => {
            this.redis.del(deployment.id + "_pid");
            if (code === 0) {
                await this.producer.sendEvent({
                    type: EEvent.DEPLOY_SUCCESS,
                    deployment_id: deployment.id,
                    commit_sha: deployment.commit,
                    auto_trigger: true
                })
            }
            if (code === 1) {
                await this.producer.sendEvent({
                    type: EEvent.DEPLOY_FAILED,
                    deployment_id: deployment.id,
                    commit_sha: deployment.commit,
                    auto_trigger: true
                })
            }
            if (code === null) {
                await this.producer.sendEvent({
                    type: EEvent.DEPLOY_CANCEL,
                    deployment_id: deployment.id,
                    commit_sha: deployment.commit,
                    auto_trigger: true
                })
            }
        }); 
    }
}