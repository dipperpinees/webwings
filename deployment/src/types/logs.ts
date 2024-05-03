export enum ELogType {
    INFO = "info",
    ERROR = "error",
}

export interface ILog {
    deployment_id: string;
    time: Date,
    message: string;
    type: ELogType
}