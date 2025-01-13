// src/store/landingPageSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface LandingPageState{
    loggedIn: boolean;
}

const initialState: LandingPageState = {
    loggedIn: false,
}

const landingPageSlice = createSlice({
    name: "landingPage",
    initialState,
    reducers: {
        toggleLogin(state) {
            state.loggedIn = !state.loggedIn;
        }
    }
});


export const { toggleLogin } = landingPageSlice.actions;

export default landingPageSlice.reducer;