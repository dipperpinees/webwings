import { IGithubRepo } from "@/features/select-repo";
import { create } from "zustand";

interface SelectedRepoState {
    selectedRepo: IGithubRepo | null;
    updateSelectedRepo: (repo: IGithubRepo) => void;
}

export const useSelectedRepo = create<SelectedRepoState>()((set) => ({
    selectedRepo: null,
    updateSelectedRepo: (repo: IGithubRepo) => {
        set(() => ({ selectedRepo: repo }));
    },
}));
