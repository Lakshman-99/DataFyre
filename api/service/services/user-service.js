import User from "../models/user.js";
import AppError from "../utils/app-error.js";
import { generateToken } from "../utils/jwt-verify.js";
import { sendVerificationEmail } from "../utils/email-templates.js";

// Create a new user
export const createUserInDb = async ({
    email,
    first_name,
    last_name,
    role,
    user_type,
    hashed_password,
    joinedDate
}) => {
    // Check if the user already exists (unique email check)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("Email is already registered.", 400);
    }

    // Create a new user instance
    const newUser = new User({
        email,
        first_name,
        last_name,
        role,
        user_type,
        hashed_password,
        joinedDate
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a verification token
    const verificationToken = generateToken(newUser);

    // Send verification email
    await sendVerificationEmail(newUser.email, verificationToken);

    return newUser;
};

// Get user by ID
export const getUserByIdFromDb = async (userId) => {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
};

// Get user by email
export const getUserByEmailFromDb = async (email) => {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
}

// Update user by ID
export const updateUserInDb = async (userId, updatedData) => {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Update user fields (excluding sensitive data like password)
    const { hashed_password, ...dataToUpdate } = updatedData;
    Object.assign(user, dataToUpdate);

    // Save the updated user to the database
    await user.save();

    return user;
};
// Fetch subordinates for a user
export const getSubordinates = async (userId) => {
    const subordinates = await User.find({ manager_id: userId }).select("-hashed_password");
    return subordinates;
};

// Delete user by ID
export const deleteUserFromDb = async (userId) => {
    // Find and delete the user by ID
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
};
