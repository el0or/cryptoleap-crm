import { createContext } from 'react';
import type { IAuthResponse, ILoginRequest, IRegisterRequest } from '@cryptoleap_crm/shared';

type AuthUser = IAuthResponse['user'];

export interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (payload: ILoginRequest) => Promise<void>;
    register: (payload: IRegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);