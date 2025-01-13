import { createUserInDb, getUserByIdFromDb, updateUserInDb, deleteUserFromDb, getSubordinates } from "../services/user-service.js";
import createAndCopyFile from "../utils/file-util.js";
import path from "path"
import {validateObjectId} from "../middlewares/validate-object-id.js";
import userRouter from "../routers/user-router.js";
// Create a new user
export const createUser = async (req, res) => {
    try {
        const {
            email,
            first_name,
            last_name,
            role,
            user_type,
            hashed_password,
        } = req.body;
        function formatDate(date) {
            const day = String(date.getDate()).padStart(2, '0'); // Get the day with leading zero
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month with leading zero
            const year = date.getFullYear(); // Get the year
            return `${day}/${month}/${year}`; // Return in dd/mm/yyyy format
        }

// Get current system date
        const currentDate = new Date();
        const joinedDate = formatDate(currentDate);

        // Call the service to create the user
        const newUser = await createUserInDb({
            email,
            first_name,
            last_name,
            role,
            user_type,
            hashed_password,
            joinedDate
        });

        // Return the created user (omit sensitive data such as password)
        const { hashed_password: password, ...userWithoutPassword } = newUser.toObject();
        res.status(201).send({
            message: "Registration successful. Please check your email to verify your account.",
            data: userWithoutPassword,
        });
    } catch (error) {
        res.status(error.statusCode || 500).send({
            message: error.message,
        });
    }
};

// Get user by ID
export const getUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Call the service to get the user by ID
        const user = await getUserByIdFromDb(userId);

        // Return user data without password
        const { hashed_password, ...userWithoutPassword } = user.toObject();
        res.send({
            message: "User retrieved successfully",
            data: userWithoutPassword,
        });
    } catch (error) {
        res.status(error.statusCode || 500).send({
            message: error.message,
        });
    }
};

// Update user by ID
export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedData = req.body;

        // Call the service to update the user
        const updatedUser = await updateUserInDb(userId, updatedData);

        // Return updated user without password
        const { hashed_password: password, ...updatedUserWithoutPassword } = updatedUser.toObject();
        res.send({
            message: "User updated successfully",
            data: updatedUserWithoutPassword,
        });
    } catch (error) {
        res.status(error.statusCode || 500).send({
            message: error.message,
        });
    }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;

        // Call the service to delete the user
        const deletedUser = await deleteUserFromDb(userId);

        res.send({
            message: "User deleted successfully",
            data: deletedUser,
        });
    } catch (error) {
        res.status(error.statusCode || 500).send({
            message: error.message,
        });
    }
};

// GET /api/v1/users/profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from authentication middleware
        const user = await getUserByIdFromDb(userId);

        if (!user) {
            return res.status(404).send({
                message: "User not found",
                data: null,
            });
        }

        // Fetch subordinates
        const subordinates = await getSubordinates(userId);

        res.status(200).send({
            message: "User profile fetched successfully",
            data: {
                ...user.toObject(),
                subordinates,
            },
        });
    } catch (error) {
        res.status(error.statusCode || 500).send({
            message: error.message,
        });
    }
};

// PUT /api/v1/users/profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;
        // Handle uploaded files
        if (req.files.profilePictureUrl) {
            const profilePicture = req.files.profilePictureUrl[0];
            // Option 1: Save the file URL to the database
            updates.profilePictureUrl = `/uploads/${profilePicture.filename}`;
            const originalPath = path.join(process.cwd(), `${profilePicture.path}`);
            const targetPath = path.join(process.cwd(), '../client/src/uploads', profilePicture.filename);
            createAndCopyFile(originalPath,targetPath);



        }

        if (req.files.coverPictureUrl) {
            const coverPicture = req.files.coverPictureUrl[0];
            updates.coverPictureUrl = `/uploads/${coverPicture.filename}`;
            const originalPath = path.join(process.cwd(), `${coverPicture.path}`);
            const targetPath = path.join(process.cwd(), '../client/src/uploads', coverPicture.filename);
            createAndCopyFile(originalPath,targetPath);

        }

        // Handle password update if present
        if (updates.hashed_password) {
            const salt = await bcrypt.genSalt(10);
            updates.hashed_password = await bcrypt.hash(updates.hashed_password, salt);
        }

        const updatedUser = await updateUserInDb(userId, updates);

        if (!updatedUser) {
            return res.status(404).send({
                message: "User not found",
                data: null,
            });
        }

        res.status(200).send({
            message: "User profile updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        res.status(error.statusCode || 500).send({
            message: error.message,
        });
    }
};
