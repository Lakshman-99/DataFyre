import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../services/axios"; // Ensure Axios is correctly configured
import { message } from "antd";

// Type for our state
interface AuthState {
    accessToken: string | null;
    loading: boolean;
    error: string | null;
}

// Initial state of the slice
const initialState: AuthState = {
    accessToken: localStorage.getItem("authToken") || null, // Load token from localStorage
    loading: false,
    error: null,
};

// Async thunk for user login
export const loginUser = createAsyncThunk<
    string, // Return type: JWT token as string
    { email: string; password: string }, // Argument type
    { rejectValue: string }
>(
    "auth/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/v1/users/signin", { email, password });
            const token = response.data.data.token;
            // Store token in localStorage for persistence
            localStorage.setItem("authToken", token);
            return token;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Login failed";
            return rejectWithValue(errorMessage);
        }
    }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk<
    void,
    void,
    { rejectValue: string }
>(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            // If your backend has a logout endpoint to invalidate tokens, call it here
            return;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Logout failed";
            return rejectWithValue(errorMessage);
        }
    }
);

// Create the slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Action to set the access token
        setAccessToken(state, action: PayloadAction<string>) {
            state.accessToken = action.payload;
            localStorage.setItem("authToken", action.payload); // Save to localStorage
        },
        // Action to clear the access token (for logout)
        clearAccessToken(state) {
            state.accessToken = null;
            state.error = null;
            localStorage.removeItem("authToken"); // Remove token from localStorage
        },
    },
    extraReducers: (builder) => {
        // Handle loginUser
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.accessToken = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
                message.error(state.error); // Optional: Display error message
            });

        // Handle logoutUser
        builder
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.accessToken = null;
                localStorage.removeItem("authToken");
                message.success("Logged out successfully"); // Optional: Display success message
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Logout failed";
                message.error(state.error); // Optional: Display error message
            });
    },
});

// Export actions
export const { setAccessToken, clearAccessToken } = authSlice.actions;

// Export the reducer to add to the store
export default authSlice.reducer;
