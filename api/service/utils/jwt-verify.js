import jwt from "jsonwebtoken";
import AppError from "./app-error.js";

// Function to generate JWT token for authenticated user
export const generateToken = (user) => {
    const token = jwt.sign(
        { id: user._id, first_name: user.first_name, email: user.email, role: user.role, is_verified: user.is_verified },
        process.env.JWT_SECRET,
        { expiresIn: "1d" } // Token expiration time
    );
    return token;
};


export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using secret
        return decoded; // Return the decoded token if successful
    } catch (error) {
        throw new AppError('Invalid or expired token', 401);
    }
};

export const generateVerificationToken = (email, applicationId, ownerId, role) => {
    const payload = {
        email,
        applicationId,
        ownerId, 
        role,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};