import express from "express";
import { validateObjectId } from "../middlewares/validate-object-id.js";
import { getAllApiEndpoints, createApiEndpointHandler, getApiEndpointByIdHandler, updateApiEndpointHandler, deleteApiEndpointHandler, populateApiEndpointHandler } from "../controllers/api-endpoint-controller.js";

const apiEndpointRouter = express.Router();

// Get all API endpoints
apiEndpointRouter.get("/application/:id", validateObjectId, getAllApiEndpoints);

// Create a new API endpoint
apiEndpointRouter.post("/", createApiEndpointHandler);

// Trigger population for a specific API endpoint
apiEndpointRouter.post("/:id/trigger-population", validateObjectId, populateApiEndpointHandler);

// Get a specific API endpoint by ID
apiEndpointRouter.get("/:id", validateObjectId, getApiEndpointByIdHandler);

// Update a specific API endpoint by ID
apiEndpointRouter.put("/:id", validateObjectId, updateApiEndpointHandler);

// Delete a specific API endpoint by ID
apiEndpointRouter.delete("/:id", validateObjectId, deleteApiEndpointHandler);

export default apiEndpointRouter;
