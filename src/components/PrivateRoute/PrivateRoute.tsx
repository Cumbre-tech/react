import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface PrivateRouteProps {
    loginPath?: string; // Path to redirect unauthenticated users
    checkOnboarding?: boolean; // Whether to check onboarding status
    onboardingKey?: string; // Key to check onboarding status in the user object
    onboardingPath?: string; // Path to redirect users if onboarding is incomplete
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
    loginPath = "/login",
    checkOnboarding = false,
    onboardingKey = "onboarding_completed",
    onboardingPath = "/onboarding",
}) => {
    const { getToken, getUser } = useAuth();
    const isAuthenticated = !!getToken();
    const user = getUser();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect unauthenticated users to login
        return <Navigate to={loginPath} replace />;
    }

    if (
        checkOnboarding &&
        user &&
        !user[onboardingKey] &&
        location.pathname !== onboardingPath
    ) {
        // Redirect to onboarding if not completed, but avoid looping
        return <Navigate to={onboardingPath} replace />;
    }

    // User authenticated and either completed onboarding or is on the onboarding page
    return <Outlet />;
};

export default PrivateRoute;
