export interface IUser {
    id: string;
    email: string;
    role: "ADMIN" | "USER" | "MANAGER";
}

export interface IAuthResponse {
    user: IUser;
    accessToken?: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IRegisterRequest {
    email: string;
    password: string;
    name: string;
}