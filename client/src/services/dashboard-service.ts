import axios from "axios";
import axios_base from "./axios";
import { PopulationLog, TotalCountModel } from "../models/dashboard";

const authToken = localStorage.getItem("authToken");
axios_base.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

export const getDashboardOverview = async (): Promise<TotalCountModel> => {
    try {
        const response = await axios_base.get(`/dashboard/overview`);

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

export const getDashboardPopulation = async (key: string): Promise<any> => {
    try {
        const response = await axios_base.get(`/dashboard/population_timeline?key=${key}`);

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

export const getPopulationLogs = async (): Promise<PopulationLog[]> => {
    try {
        const response = await axios_base.get(`/dashboard/population_logs`);

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