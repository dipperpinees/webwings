import { Inject, Service } from "typedi";
import { StaticCaddy } from "../caddy";
import { Project } from "../project";
import { Config } from "@/config";

@Service()
export class StaticDeployment {
    constructor(
        @Inject() private readonly caddy: StaticCaddy,
        @Inject() private readonly project: Project,
        @Inject() private readonly config: Config
    ) {}

    start() {

    }
}