import { apiFetch } from "./http";

export const loginRequest = ( email: string, password: string ) => {
    return apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
    });
};

export const getCurrentUserRequest = <T>() => {
    return apiFetch<T>('/auth/me');
};

export const logoutRequest = () => {
    return apiFetch<void>('/auth/logout', {
        method: 'POST',
    },
    );
};