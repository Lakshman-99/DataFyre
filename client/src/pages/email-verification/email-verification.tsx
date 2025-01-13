import React, { useEffect, useState } from "react";
import { Result, Button } from "antd";
import axios_base from "../../services/axios.ts";
import { useNavigate } from "react-router-dom";
import {setAccessToken,clearAccessToken} from "../../redux/auth-slice.ts";
import {useDispatch} from "react-redux";
import "./email-verification.css"

const EmailVerify = () => {
    const [status, setStatus] = useState(null); // To store the API response status
    const [loading, setLoading] = useState(true); // To track loading state
    const navigate = useNavigate(); // React Router hook for navigation
    const dispatch = useDispatch();

    useEffect(() => {
        // Extract the token from the URL
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get("token");

        if (token) {
            // Make the API call
            axios_base
                .get(`/verifications/verify-email?token=${token}`)
                .then((response) => {
                    if (response.data.message=='Email verified successfully') {
                        dispatch(clearAccessToken());
                        dispatch(setAccessToken(response.data.data.token));
                        setStatus("success"); // Update status on success
                    } else {
                        setStatus("error"); // Update status on failure
                    }
                })
                .catch((error) => {
                    console.error("Error verifying token:", error);
                    setStatus("error"); // Handle API error
                })
                .finally(() => {
                    setLoading(false); // Stop loading after API call
                });
        } else {
            setStatus("error"); // If token is missing
            setLoading(false);
        }
    }, []);

    // Show loading spinner while waiting for API response
    if (loading) {
        return <div>Loading...</div>;
    }

    // Navigate to dashboard
    const handleDashboardClick = () => {
        navigate("/dashboard");
    };

    // Render based on API response status
    return (
        <div className="resut-page">
            {status === "success" && (
                <Result
                    status="success"
                    title="Successfully Verified Email!"
                    subTitle="Your email verification is complete. Welcome aboard!"
                    extra={[
                        <Button type="primary" key="dashboard" onClick={handleDashboardClick}>
                            Go to Dashboard
                        </Button>,
                    ]}
                />
            )}
            {status === "error" && (
                <Result
                    status="error"
                    title="Verification Failed"
                    subTitle="The email verification token is invalid or has expired."
                    extra={[
                        <Button type="primary" key="retry">
                            Retry Verification
                        </Button>,
                    ]}
                />
            )}
        </div>
    );
};

export default EmailVerify;
