import { GITHUB_OAUTH_CLIENT_ID } from "@/configs";

export enum OAUTH_TYPE {
    "GRANT",
    "SIGNIN"
}

export function getGitHubUrl(type: OAUTH_TYPE, state: string = "") {
    const rootURl = "https://github.com/login/oauth/authorize";

    const options = {
        client_id: GITHUB_OAUTH_CLIENT_ID,
        redirect_uri: `${window.location.origin}/auth/oauth/github?type=${type}`,
        scope: "repo,user,admin:repo_hook",
        state
    };

    const qs = new URLSearchParams(options);

    return `${rootURl}?${qs.toString()}`;
}