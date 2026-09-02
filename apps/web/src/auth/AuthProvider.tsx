import { type PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import type { IAuthResponse } from "@cryptoleap_crm/shared";
import { getCurrentUserRequest, loginRequest, logoutRequest, registerRequest } from '../api/api.auth.ts';
import { ApiError } from "../api/http";
import { AuthContext } from "./AuthContext";
import type { ILoginRequest } from "@cryptoleap_crm/shared";
import type { IRegisterRequest } from "@cryptoleap_crm/shared";

type AuthUser = IAuthResponse['user'];

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const currentUser = await getCurrentUserRequest();
            setUser(currentUser);
        } catch (error) {
            if ( error instanceof ApiError && error.status === 401 ) {
                setUser(null);
                return;
            }

            setUser(null);
        }
    }, [])

    const login = useCallback(async (payload: ILoginRequest) => {
        const response = await loginRequest(payload);
        setUser(response.user);
    }, []);

    const register = useCallback(async (payload: IRegisterRequest) => {
        const response = await registerRequest(payload);
        setUser(response.user);
    }, []);

    const logout = useCallback(async () => {
        await logoutRequest();

        setUser(null);
    }, []);

    useEffect(() => {const initializeAuth = async () => {
        try {
            await refreshUser();
        } finally {
            setIsLoading(false);
        }
        };

        initializeAuth();
    }, [refreshUser]);

    const value = useMemo(() => ({
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        refreshUser,
    }), [user, isLoading, login, register, logout, refreshUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}