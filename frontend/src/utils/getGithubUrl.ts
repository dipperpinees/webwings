import { GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_REDIRECT_URL } from "@/configs";

export function getGitHubUrl(userId: number) {
    const rootURl = "https://github.com/login/oauth/authorize";

    const options = {
        client_id: GITHUB_OAUTH_CLIENT_ID,
        redirect_uri: `${GITHUB_OAUTH_REDIRECT_URL}?user=${userId}`,
        scope: "repo,user,admin:repo_hook",
    };

    const qs = new URLSearchParams(options);

    return `${rootURl}?${qs.toString()}`;
}