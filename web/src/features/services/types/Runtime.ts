export interface IRuntime {
    name: string;
    image: string;
    versions: IRuntimeVersion[];
    build_command: string;
    start_command: string;
}

export interface IRuntimeVersion {
    id: string;
    runtime_name: string;
    name: string;
    tag: string;
}