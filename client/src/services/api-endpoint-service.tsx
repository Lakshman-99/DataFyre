import axios from "axios";
import axios_base from "./axios";
import { APIEndpoints, TriggerPopulation } from "../models/api-endpoint";

const authToken = localStorage.getItem("authToken");
axios_base.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

export const getAPIEndpoints = async (applicationId: string): Promise<APIEndpoints[]> => {
    try {
        const response = await axios_base.get(`/api_endpoints/application/${applicationId}`);

        if (response.status === 200 || response.status === 201) {
            return response.data.data;
        } else {
            throw new Error("Failed to fetch API Endpoints");
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

export const createApiEndpoint = async (apiEndpoint: APIEndpoints): Promise<APIEndpoints> => {
    try {
        const response = await axios_base.post("/api_endpoints", apiEndpoint);

        if (response.status === 200 || response.status === 201) {
            return response.data.data;
        } else {
            throw new Error("Failed to create API endpoint");
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

export const updateApiEndpointById = async (apiEndpointId: string | undefined, apiEndpoint: APIEndpoints): Promise<APIEndpoints> => {
    try {
        const response = await axios_base.put(`/api_endpoints/${apiEndpointId}`, apiEndpoint);
        if (response.status === 200 || response.status === 201) {
            return response.data.data;
        } else {
            throw new Error("Failed to update API Endpoint");
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

export const deleteApiEndpointById = async (apiEndpointId: string): Promise<string> => {
    try {
        const response = await axios_base.delete(`/api_endpoints/${apiEndpointId}`);
        if (response.status === 200 || response.status === 201) {
            return apiEndpointId;
        } else {
            throw new Error("Failed to delete Api Endpoint");
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

export const triggerPopulation = async (apiEndpointId: string | undefined, populationDetails: TriggerPopulation) => {
    try {
        const response = await axios_base.post(`/api_endpoints/${apiEndpointId}/trigger-population`, populationDetails);
        if (response.status === 200 || response.status === 201) {
            return response.data.data;
        } else {
            throw new Error("Failed to update API Endpoint");
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