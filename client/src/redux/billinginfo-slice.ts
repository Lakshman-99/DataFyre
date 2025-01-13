import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BillingInfo } from '../models/billinginfo';
import { AppState } from "./store";

export type BillingInfoState = Array<BillingInfo>

// Initial state for billing info
const initialState : BillingInfoState = [];

const billingSlice = createSlice({
    name: 'billing',
    initialState,
    reducers: {
        loadBillingInfo: (state: BillingInfoState, action: PayloadAction<BillingInfoState>) => {
            return [...action.payload];
        },
        addBillingInfo: (state: BillingInfoState, action: PayloadAction<BillingInfo>) => {
            return [...state, action.payload];
        },
        updateBillingInfo: (state: BillingInfoState, action: PayloadAction<BillingInfo>) => {
            const index = state.findIndex(billinginfo => billinginfo._id === action.payload._id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        deleteBillingInfo: (state: BillingInfoState, action: PayloadAction<string>) => {
            return state.filter(billinginfo => billinginfo._id !== action.payload);
        }
    },
});

export const { loadBillingInfo, addBillingInfo, updateBillingInfo, deleteBillingInfo } = billingSlice.actions;

// Selector to get the billing info from the store
export const selectBillingInfo = (state: AppState) => state.billinginfo;


export default billingSlice.reducer;
