export enum EEventType {
    INIT_DEPLOY = "INIT_DEPLOY",
    DEPLOY_FAILED = "DEPLOY_FAILED",
    DEPLOY_SUCCESS = "DEPLOY_SUCCESS",
    NEW_DEPLOY = "NEW_DEPLOY",
    DEPLOY_CANCEL = "DEPLOY_CANCEL",
}

export interface IEvent {
    id: string;
    commit_sha: string;
    commit_msg: string;
    type: EEventType;
    auto_trigger: boolean;
    created_at: string;
    updated_at: string;
}