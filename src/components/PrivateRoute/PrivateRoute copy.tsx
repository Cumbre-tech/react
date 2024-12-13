import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PrivateRoute: React.FC = () => {
    const { getToken, getUser } = useAuth();
    const isAuthenticated = !!getToken();
    const user = getUser();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect unauthenticated users to login
        return <Navigate to="/login" replace />;
    }

    if (user && !user.onboarding_completed && location.pathname !== "/onboarding") {
        // Redirect to onboarding if not completed, but avoid looping
        return <Navigate to="/onboarding" replace />;
    }

    // User authenticated and either completed onboarding or is on the onboarding page
    return <Outlet />;
};

export default PrivateRoute;
