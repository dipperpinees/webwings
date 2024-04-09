export enum ELogType {
    INFO = "info",
    ERROR = "error",
}

export interface ILog {
    deployment_id: string;
    time: string,
    message: string;
    type: ELogType
}