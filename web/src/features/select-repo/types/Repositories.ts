export interface IGithubRepo {
    "id": number;
    "name": string;
    "full_name": string;
    "private": boolean;
    "html_url": string;
    "description": string;
    "url": string;
    "git_url": string;
    "ssh_url": string;
    "clone_url": string;
    "language": string;
    "default_branch": string;
    "archived": boolean;
    "stargazers_count": number;
    "created_at": string;
    "updated_at": string;
    "owner": {
        "login": string
    }
}