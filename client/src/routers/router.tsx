import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Dashboard from "../pages/dashboard/dashboard";
import NotFoundPage from "../pages/extra-pages/page-not-found";
import SignInPage from "../pages/authentication/signin";
import SignUpPage from "../pages/authentication/signup";
import Application from "../pages/application/application";
import Main from "../pages/dashboard/layout/Main";
import Billinginfo from "../pages/billinginfo/billinginfo";
import ApiEndpoint from "../pages/api-endpoints/api-endpoint";
import ApiEndpointForm from "../pages/api-endpoints/api-endpoint-form";
import ViewProfile from "../pages/profile/ViewProfile";
import EditProfile from "../pages/profile/EditProfile";
import ProtectedRoute from "../routers/ProtectedRoute.tsx";
import EmailVerification from "../pages/email-verification/email-verification.tsx";
import DeleteProfile from "../pages/profile/DeleteProfile.tsx";
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/login",
        element: <SignInPage />,
    },
    {
        path: "/signup",
        element: <SignUpPage />,
    },
    {
        path: "/verify/email",
        element: <EmailVerification />,
    },
    {
        path: "/verify/email",
        element: <SignUpPage />,
    },
    {
        path: "/applications",
        element: (
            <ProtectedRoute element={<Main />} />
        ),
        children: [
            {
                path: "/applications",
                element: (
                    <ProtectedRoute element={<Application />} />
                ),
            },
            {
                path: "/applications/:id",
                element: (
                    <ProtectedRoute element={<ApiEndpoint />} />
                ),
            },
            {
                path: "/applications/:applicationId/add",
                element: (
                    <ProtectedRoute element={<ApiEndpointForm />} />
                ),
            },
            {
                path: "/applications/:applicationId/edit/:apiEndpointId",
                element: (
                    <ProtectedRoute element={<ApiEndpointForm />} />
                ),
            },
        ],
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute element={<Main />} />
        ),
        children: [
            {
                path: "/dashboard",
                element: (
                    <ProtectedRoute element={<Dashboard />} />
                ),
            },
        ],
    },
    {
        path: "/billinginfo",
        element: (
            <ProtectedRoute element={<Main />} />
        ),
        children: [
            {
                path: "/billinginfo",
                element: (
                    <ProtectedRoute element={<Billinginfo />} />
                ),
            },
        ],
    },
    // New Profile Parent Route
    {
        path: "/profile",
        element: (
            <ProtectedRoute element={<Main />} />
        ),
        children: [
            {
                path: "view",
                element: (
                    <ProtectedRoute element={<ViewProfile />} />
                ),
            },
            {
                path: "edit",
                element: (
                    <ProtectedRoute element={<EditProfile />} />
                ),
            },
            {
                path: "delete",
                element: (
                    <ProtectedRoute element={<DeleteProfile />} />
                ),
            },
        ],
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);

export default router;