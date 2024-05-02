export enum EEvent {
    INIT_DEPLOY    = "INIT",
	NEW_DEPLOY     = "NEW_DEPLOY",
	DEPLOY_CANCEL  = "DEPLOY_CANCEL",
	DEPLOY_FAILED  = "DEPLOY_FAILED",
	DEPLOY_SUCCESS = "DEPLOY_SUCCESS",
    DEPLOY_SUSPEND = "DEPLOY_SUSPEND"
}

export interface IEvent {
    deployment_id: string;
    commit_sha: string | null;
    type: EEvent;
    auto_trigger: boolean;
    external_ip?: string;
    commit_msg: string | null;
}