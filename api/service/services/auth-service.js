import User from "../models/user.js";
import AppError from "../utils/app-error.js";

// Function to check if the user exists and verify password
export const authenticateUser = async (email, password) => {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Compare the provided password with the hashed password stored in DB
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new AppError("Invalid credentials", 401);
    }

    return user;
};
