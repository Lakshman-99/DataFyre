import axios from "axios";
import { BillingInfo } from "../models/billinginfo";
import axios_base from "./axios";

const authToken = localStorage.getItem("authToken");
axios_base.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

export const getBillingInfo = async (): Promise<BillingInfo[]> => {
    try {
        const response = await axios_base.get("/billing-info");

        if (response.status === 200 || response.status === 201) {
            return response.data.data;
        } else {
            throw new Error("Failed to fetch Billing Info");
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

export const getBillingInfoById = async (billingid: string): Promise<BillingInfo> => {
    try {
        const response = await axios_base.get(`/billing-info/${billingid}`);

        if (response.status === 200 || response.status === 201) {
            return response.data.data;
        } else {
            throw new Error("Failed to fetch Billing Info");
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

export const createBillingInfo = async (billingInfo : BillingInfo ): Promise<BillingInfo> => {
    try {
        const response = await axios_base.post("/billing-info",billingInfo);

        if (response.status === 200 || response.status === 201) {
            return response.data.data;
        } else {
            throw new Error("Failed to create Billing Info");
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

export const updateBillingInfoById = async (billingid : string | undefined , billingInfo : BillingInfo ): Promise<BillingInfo> => {
    try {
        const response = await axios_base.put(`/billing-info/${billingid}`,billingInfo);

        if (response.status === 200 || response.status === 201) {
            return response.data.data;
        } else {
            throw new Error("Failed to update Billing Info");
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

export const deleteBillingInfoById = async (billingid : string | undefined): Promise<BillingInfo> => {
    try {
        const response = await axios_base.delete(`/billing-info/${billingid}`);

        if (response.status === 200 || response.status === 201) {
            return response.data.data;
        } else {
            throw new Error("Failed to delete Billing Info");
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