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