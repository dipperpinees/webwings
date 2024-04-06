export enum EEvent {
    INIT_DEPLOY    = "INIT",
	NEW_DEPLOY     = "NEW_DEPLOY",
	DEPLOY_CANCEL  = "DEPLOY_CANCEL",
	DEPLOY_FAILED  = "DEPLOY_FAILED",
	DEPLOY_SUCCESS = "DEPLOY_SUCCESS",
}

export interface IEvent {
    deploymentID: string;
    commit_sha: string;
    type: EEvent;
}