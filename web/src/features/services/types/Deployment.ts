import { IOAuth } from "@/features/select-repo";
import { IEvent, IRuntimeVersion } from ".";

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
    id: string;
    type: EDeploymentType;
    repo: string;
    name: string;
    repo_url: string;
    runtime: IRuntimeVersion;
    auto_deploy: boolean;
    build_command: string;
    branch: string;
    root: string;
    status: EDeployStatus;
    created_at: Date;
    updated_at: Date;
    oauth_id: string;
    oauth: IOAuth;
    domain: string;
    commit_url: string;
    commit_sha: string;
    event: IEvent[];
    start_command: string;
    env: string;
}

export interface ICreateDeployment {
    type: EDeploymentType;
    repo: string;
    name: string;
    repo_url: string;
    runtime: number;
    auto_deploy: boolean | string;
    build_command: string;
    branch: string;
    root: string;
    oauth_id: string;
    start_command: string;
    env_variables: string;
}

export interface IUpdateDeployment {
    id: string;
    name: string;
    auto_deploy: boolean | string;
    build_command: string;
    branch: string;
    root: string;
    start_command: string;
    env_variables: string;
}

export interface IEnvironment {
    key: string;
    value: string;
}

export enum ELogBoxType {
    "BUILD" = "BUILD",
    "APP" = "APP"
}