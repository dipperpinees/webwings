import { IEnvironment } from "@/features/services";
import { create } from "zustand";

interface EnvState {
    env: IEnvironment[];
    updateEnv: (env: IEnvironment[]) => void;
}

export const useEnvStore = create<EnvState>()((set) => ({
    env: [{
        key: "",
        value: ""
    }],
    updateEnv: (env: IEnvironment[]) => {
        set(() => ({ env }));
    },
}));
