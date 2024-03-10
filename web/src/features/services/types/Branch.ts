export interface IBranch {
    name: string;
    protected: string;
    commit: {
        sha: string;
        url: string;
    }
}