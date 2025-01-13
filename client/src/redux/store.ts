import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./language-slice";
import authReducer from "./auth-slice";
import ApplicationReducer from "./application-slice";
import BillingInfoReducer from "./billinginfo-slice";
import ApiEndpointReducer from "./api-endpoint-slice";
import themeReducer from "./theme-slice";
import userReducer from './userSlice';

export const store = configureStore({
    reducer: {
        language: languageReducer,
        auth: authReducer, 
        application: ApplicationReducer,
        billinginfo: BillingInfoReducer,
        user: userReducer,

        apiendpoint: ApiEndpointReducer,
        theme: themeReducer,
    },
});

// TypeScript types for the Redux state and dispatch
export type AppStore = typeof store;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;