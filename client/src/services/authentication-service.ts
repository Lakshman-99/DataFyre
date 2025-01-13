// service.ts
import axios_base from "./axios";
import axios from "axios";
import { SignInPayload, SignUpData } from "../models/authentication";

export const signIn = async (payload: SignInPayload) => {
    try {
        const response = await axios_base.post("/login", payload);

        // If the response status is 200, process the data
        if (response.status === 200) {
            return response.data; // Return the data to the calling function
        }
    } catch (error: unknown) {
        // Handle errors
        if (axios.isAxiosError(error)) {
            // Handle known axios error
            if (error.response) {
                if (error.response.status === 404) {
                    throw new Error(error.response.data.message);
                } else {
                    throw new Error(
                        `Server responded with status ${error.response.status}: ${error.response.statusText}`
                    );
                }
            } else {
                throw new Error(
                    "Error in setting up the request: " + error.message
                );
            }
        } else {
            // Handle other unknown errors
            throw new Error("An unknown error occurred");
        }
    }
};

// The service function to send a POST request to the sign-up API
export const signUp = async (userData: SignUpData) => {
    try {
        const response = await axios_base.post("/users", userData);

        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            throw new Error("Sign-up failed");
        }
    } catch (error: unknown) {
        // Handle errors
        if (axios.isAxiosError(error)) {
            // Handle known axios error
            if (error.response) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error(
                    "Error in setting up the request: " + error.message
                );
            }
        } else {
            // Handle other unknown errors
            throw new Error("An unknown error occurred");
        }
    }
};
