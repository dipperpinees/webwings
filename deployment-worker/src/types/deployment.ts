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

interface IDeployment {
    id: string;
    user_id: string;
    oauth: IOAuth;
    name: string;
    repo: string;
    repo_url: string;
    auto_deploy: boolean;
    build_command: string;
    branch: string;
    root: string;
    type: EDeploymentType;
}

export interface IStaticDeployment extends IDeployment {};

export interface IWebServiceDeployment extends IDeployment {
    web_service: {
        runtime: string;
    }
}