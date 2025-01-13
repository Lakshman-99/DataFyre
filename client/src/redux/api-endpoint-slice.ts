import { AppState } from "./store";
import { APIEndpoints } from "../models/api-endpoint";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ApiEndpointState = Array<APIEndpoints>;

const initialState: ApiEndpointState = [];

export const apiEndpointSlice = createSlice({
    name: 'api-endpoint',
    initialState,
    reducers: {
        loadApiEndpoints: (state: ApiEndpointState, action: PayloadAction<ApiEndpointState>) => {
            return [...action.payload];
        },
        addApiEndpoint: (state: ApiEndpointState, action: PayloadAction<APIEndpoints>) => {
            return [...state, action.payload];
        },
        addApiEndpoints: (state: ApiEndpointState, action: PayloadAction<APIEndpoints[]>) => {
            const existingIds = new Set(state.map((item) => item._id)); // Collect all existing _ids
            const filteredPayload = action.payload.filter((item) => !existingIds.has(item._id)); // Filter out duplicates
            return [...state, ...filteredPayload]; // Add only unique items to the state
        },
        updateApiEndpoint: (state: ApiEndpointState, action: PayloadAction<APIEndpoints>) => {
            const index = state.findIndex(apiEndpoint => apiEndpoint._id === action.payload._id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        deleteApiEndpoint: (state: ApiEndpointState, action: PayloadAction<string>) => {
            return state.filter(apiEndpoint => apiEndpoint._id !== action.payload);
        }
    }
})

export const { loadApiEndpoints, deleteApiEndpoint, addApiEndpoint, addApiEndpoints, updateApiEndpoint } = apiEndpointSlice.actions;

export const selectApiEndpoints = (state: AppState) => state.apiendpoint;

export const findApiEndpoint = (id: string | undefined): (state: AppState) => APIEndpoints | undefined => {
    return (state: AppState) => state.apiendpoint.find(apiEndpoint => apiEndpoint._id === id && id !== undefined);
}

export const selectApiEndpointsByApplicationId = (applicationId: string | undefined): (state: AppState) => APIEndpoints[] => {
    return (state: AppState) => state.apiendpoint.filter(apiEndpoint => apiEndpoint.application_id === applicationId && applicationId !== undefined);
}

export default apiEndpointSlice.reducer;