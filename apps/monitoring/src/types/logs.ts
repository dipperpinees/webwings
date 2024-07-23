export enum ELogType {
    INFO = "INFO",
    ERROR = "ERROR",
}

export interface ILog {
    deployment_id: string;
    time: Date,
    message: string;
    type: ELogType
}