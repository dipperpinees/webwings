import { IRuntime } from ".";

export enum EDeploymentType {
    STATIC = "STATIC",
    WEB = "WEB",
}

export enum EDeployStatus {
    PROGESSING = "PROGESSING",
    FAILED = "FAILED",
    SUCCESS = "SUCCESS"
}

export interface IDeployment {
    type: EDeploymentType;
    repo: string;
    name: string;
    repo_url: string;
    runtime: IRuntime;
    auto_deploy: boolean;
    build_command: string;
    branch: string;
    root: string;
    status: EDeployStatus;
    created_at: Date;
    updated_at: Date;
}
