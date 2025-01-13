import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../redux/store"; // Import the AppState type for Redux state

interface ProtectedRouteProps {
    element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const location = useLocation();
    const accessToken = useSelector((state: AppState) => state.auth.accessToken);

    // If not authenticated, redirect to login page
    if (!accessToken) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // Render the protected component
    return element;
};

export default ProtectedRoute;
