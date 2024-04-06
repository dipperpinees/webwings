import { EEvent, IDeployment } from "@/types";
import path from "node:path";
import { Worker, WorkerOptions } from "node:worker_threads";
import { Inject, Service } from "typedi";
import Redis from "../redis";
import { Producer } from "../amqp/producers";
import kill from "tree-kill";
import { spawn } from "node:child_process";

function importWorker(path: string, options: WorkerOptions) {
    const resolvedPath = require.resolve(path);
    return new Worker(resolvedPath, {
        ...options,
        execArgv: /\.ts$/.test(resolvedPath) ? ["--require", "ts-node/register"] : undefined,
        env: process.env
    });
}

@Service()
export class WebDeployment {
    constructor(
        @Inject() private readonly redis: Redis,
        @Inject() private readonly producer: Producer
    ) {}
    async start(deployment: IDeployment, cb: (log: string) => void) {
        console.log("🚀 ~ WebDeployment ~ start ~ deployment:", deployment)
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
        });
        childProcess.stderr.on('data', (data) => {
            cb(`${data}`.trim());
        });
        childProcess.on('close', async (code) => {
            this.redis.del(deployment.id + "_pid");
            if (code === 0) {
                await this.producer.sendEvent({
                    type: EEvent.DEPLOY_SUCCESS,
                    deploymentID: deployment.id,
                    commit_sha: deployment.commit
                })
            }
            if (code === 1) {
                await this.producer.sendEvent({
                    type: EEvent.DEPLOY_FAILED,
                    deploymentID: deployment.id,
                    commit_sha: deployment.commit
                })
            }
        }); 
        // const worker = importWorker(path.join(__dirname, "./__child_process/deployment.worker.ts"), {});
        // this.redis.set(deployment.id + "_pid", worker.threadId, {
        //     EX: 10 * 60
        // });
        // worker.postMessage({ type: "start", message: deployment });
        // worker.on("message", ({ type, message }: { type: string, message: string }) => {
        //     switch (type) {
        //         case "logs":
        //             cb(message?.trim());
        //             break;
        //         default:
        //     }
        // })

        // worker.on("error", (err) => {
        //     console.error(err)
        // })

        // worker.on("exit", async (code) => {
        //     if (code === 0) {
        //         await this.producer.sendEvent({
        //             type: EEvent.DEPLOY_SUCCESS,
        //             deploymentID: deployment.id,
        //             commit_sha: deployment.commit
        //         })
        //     } else {
        //         await this.producer.sendEvent({
        //             type: EEvent.DEPLOY_FAILED,
        //             deploymentID: deployment.id,
        //             commit_sha: deployment.commit
        //         })
        //     }
        //     this.redis.del(deployment.id + "_pid");
        // })
    }
}