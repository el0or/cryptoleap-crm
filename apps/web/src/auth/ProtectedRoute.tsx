import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

export const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if ( !isAuthenticated ) {
        return(
            <Navigate to="/" replace />
        );
    }

    return <Outlet />;
}