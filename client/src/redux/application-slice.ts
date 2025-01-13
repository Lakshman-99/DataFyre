import { AppState } from "./store";
import { Application } from "../models/application";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ApplicationState = Array<Application>;

const initialState: ApplicationState = [];

export const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        loadApplications: (state: ApplicationState, action: PayloadAction<ApplicationState>) => {
            return [...action.payload];
        },
        addApplication: (state: ApplicationState, action: PayloadAction<Application>) => {
            return [...state, action.payload];
        },
        updateApplication: (state: ApplicationState, action: PayloadAction<Application>) => {
            const index = state.findIndex(application => application._id === action.payload._id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        deleteApplication: (state: ApplicationState, action: PayloadAction<string>) => {
            return state.filter(application => application._id !== action.payload);
        },
        decrementEntityCount: (state: ApplicationState, action: PayloadAction<string>) => {
            const index = state.findIndex(application => application._id === action.payload);
            if (index !== -1) {
                state[index].entity_count -= 1;
            }
        },
        incrementEntityCount: (state: ApplicationState, action: PayloadAction<string>) => {
            const index = state.findIndex(application => application._id === action.payload);
            if (index !== -1) {
                state[index].entity_count += 1;
            }
        }
    }
})

export const { loadApplications, deleteApplication, addApplication, updateApplication, decrementEntityCount, incrementEntityCount } = applicationSlice.actions;

export const selectApplications = (state: AppState) => state.application;

export const findApplication = (id: string | undefined): (state: AppState) => Application | undefined => {
    return (state: AppState) => state.application.find(application => application._id === id && id !== undefined);
}

export default applicationSlice.reducer;