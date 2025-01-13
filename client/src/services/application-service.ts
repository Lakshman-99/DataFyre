import axios from "axios";
import { Application } from "../models/application";
import axios_base from "./axios";

const authToken = localStorage.getItem("authToken");
axios_base.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

export const getApplications = async (): Promise<Application[]> => {
    try {
        const response = await axios_base.get("/applications");

        if (response.status === 200 || response.status === 201) {
            return response.data.data;
        } else {
            throw new Error("Failed to fetch applications");
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

export const getApplicationById = async (applicationId: string): Promise<Application> => {
    try {
        const response = await axios_base.get(`/applications/${applicationId}`);
        if (response.status === 200 || response.status === 201) {
            return response.data.data;
        } else {
            throw new Error("Failed to fetch application");
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

export const createApplication = async (application: Application): Promise<Application> => {
    try {
        const response = await axios_base.post("/applications", application);

        if (response.status === 200 || response.status === 201) {
            return response.data.data;
        } else {
            throw new Error("Failed to create application");
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

export const updateApplicationById = async (applicationId: string | undefined, application: Application): Promise<Application> => {
    try {
        const response = await axios_base.put(`/applications/${applicationId}`, application);
        if (response.status === 200 || response.status === 201) {
            return response.data.data;
        } else {
            throw new Error("Failed to update application");
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

export const deleteApplicationById = async (applicationId: string): Promise<string> => {
    try {
        const response = await axios_base.delete(`/applications/${applicationId}`);
        if (response.status === 200 || response.status === 201) {
            return applicationId;
        } else {
            throw new Error("Failed to delete application");
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