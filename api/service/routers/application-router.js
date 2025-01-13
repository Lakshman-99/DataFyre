import express from "express";
import { validateObjectId } from "../middlewares/validate-object-id.js";
import { getAllApplications, createApplication, getApplicationById, updateApplication, deleteApplication } from "../controllers/application-controller.js";


const applicationRouter = express.Router();

// Get all applications
applicationRouter.get("/", getAllApplications);

// Create a new application
applicationRouter.post("/", createApplication);

// Get a specific application by ID
applicationRouter.get("/:id", validateObjectId, getApplicationById);

// Update a specific application by ID
applicationRouter.put("/:id", validateObjectId, updateApplication);

// Delete a specific application by ID
applicationRouter.delete("/:id", validateObjectId, deleteApplication);

export default applicationRouter;
