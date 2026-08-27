import type { IAuthResponse, ILoginRequest, IRegisterRequest } from '@cryptoleap_crm/shared';
import { apiFetch } from './http';

export const loginRequest = (payload: ILoginRequest) => {
    return apiFetch<IAuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export const registerRequest = (payload: IRegisterRequest) => {
    return apiFetch<IAuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export const getCurrentUserRequest = () => {
    return apiFetch<IAuthResponse['user']>('/auth/me');
};

export const logoutRequest = () => {
    return apiFetch<void>('/auth/logout', {
        method: 'POST',
    });
};