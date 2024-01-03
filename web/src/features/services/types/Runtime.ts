export interface IRuntime {
    name: string;
    image: string;
    versions: IRuntimeVersion[]
}

export interface IRuntimeVersion {
    runtime_name: string;
    name: string;
    tag: string;
}