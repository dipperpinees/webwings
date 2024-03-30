export enum EDeploymentType {
    STATIC= "STATIC",
    WEB="WEB"
}

interface IOAuth {
    id: string;
    git_user_id: string;
    username: string;
    access_token: string;
    url: string;
}

interface IRuntime {
    id: number;
    name: string;
    tag: string;
    runtime_name: string;
}

export interface IDeployment {
    id: string;
    user_id: string;
    oauth: IOAuth;
    name: string;
    repo: string;
    repo_url: string;
    auto_deploy: boolean;
    build_command: string;
    start_command: string;
    branch: string;
    root: string;
    type: EDeploymentType;
    runtime: IRuntime;
    commit: string;
    env: string;
}