import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../services/axios'; // Ensure Axios is configured

// Define the shape of the user profile data
interface Subordinate {
    _id: string;
    first_name: string;
    last_name: string;
    role: string[];
    profilePictureUrl: string;
}

interface UserProfile {
    is_active: boolean;
    joinedDate: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    contactInfo: string;
    about: string;
    organizationHierarchy: string;
    coverPictureUrl: string;
    profilePictureUrl: string;
    subordinates: Subordinate[];
}

// Async thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk<
    UserProfile,
    void,
    { rejectValue: string }
>(
    'user/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('users/profile');
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

// Async thunk to update user profile
export const updateUserProfile = createAsyncThunk<
    UserProfile,
    Partial<UserProfile>,
    { rejectValue: string }
>(
    'user/updateUserProfile',
    async (updatedData, { rejectWithValue }) => {
        try {

            const response = await axios.put('users/profile', updatedData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

// Async thunk to delete user profile
export const deleteUserProfile = createAsyncThunk<
    void,
    void,
    { rejectValue: string }
>(
    'user/deleteUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            await axios.delete('users');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete profile');
        }
    }
);

interface UserState {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    updateSuccess: boolean;
}

const initialState: UserState = {
    profile: null,
    loading: false,
    error: null,
    updateSuccess: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUpdateSuccess: (state) => {
            state.updateSuccess = false;
        },
    },
    extraReducers: (builder) => {
        // Handle fetchUserProfile
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch profile';
            });

        // Handle updateUserProfile
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.updateSuccess = false;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.updateSuccess = true;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update profile';
                state.updateSuccess = false;
            });

        // Handle deleteUserProfile
        builder
            .addCase(deleteUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUserProfile.fulfilled, (state) => {
                state.loading = false;
                state.profile = null; // Clear profile after successful deletion
            })
            .addCase(deleteUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete profile';
            });
    },
});

export const { clearUpdateSuccess } = userSlice.actions;

// Selectors
export const selectUserProfile = (state: { user: UserState }) => state.user.profile;
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUserUpdateSuccess = (state: { user: UserState }) => state.user.updateSuccess;

export default userSlice.reducer;
