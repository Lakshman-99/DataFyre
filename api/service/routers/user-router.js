import express from "express";
import { validateObjectId } from "../middlewares/validate-object-id.js";
import { createUser, getUser, updateUser, deleteUser,getProfile, updateProfile } from "../controllers/user-controller.js";
import authenticate from "../middlewares/authenticate.js";
import {upload} from "../middlewares/upload.js";
const userRouter = express.Router();

// Create a new user
userRouter.post("/", createUser);

userRouter.get('/profile',authenticate, getProfile); // Get user profile
userRouter.put('/profile', authenticate,upload.fields([
    { name: "profilePictureUrl", maxCount: 1 },
    { name: "coverPictureUrl", maxCount: 1 },
]),updateProfile); // Update user profile

// Get user by ID
userRouter.get("/:id", validateObjectId, getUser);

// Update user by ID
userRouter.put("/:id", validateObjectId, updateUser);

// Delete user by ID
userRouter.delete("/",authenticate, deleteUser);
// Protected Routes


export default userRouter;
