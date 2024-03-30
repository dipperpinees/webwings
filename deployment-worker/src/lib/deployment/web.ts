import { IDeployment } from "@/types";
import path from "node:path";
import { Worker, WorkerOptions } from "node:worker_threads";
import { Service } from "typedi";

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
    constructor() {}
    start(deployment: IDeployment, cb: (log: string) => void) {
        const worker = importWorker(path.join(__dirname, "./__child_process/deployment.cp.ts"), {});
        worker.postMessage({ type: "start", message: deployment });

        worker.on("message", ({ type, message }: { type: string, message: string }) => {
            switch (type) {
                case "logs":
                    cb(message?.trim());
                    break;
                default:
            }
        })
    }
}