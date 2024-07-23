export interface IUser {
    id: number;
    name?: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAuthRepsonse {
    id: number;
    name?: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    accessToken: string;
}

export interface IGoogleResponse {
    access_token: string;
    exprires_in: number;
    scope: string;
    token_type: string;
    auth_user: string;
    prompt: string;
}