import { getApiEndpointsForApplication, createApiEndpoint, getApiEndpointById, updateApiEndpoint, deleteApiEndpoint, populateApiEndpoint } from "../services/api-endpoint-service.js";

// Get all API endpoints associated with the user's accessible applications
export const getAllApiEndpoints = async (req, res) => {
    const { id: applicationId } = req.params;

    try {
        const userId = req.user.id; // Get the user ID from request

        // Get all API endpoints for the application
        const apiEndpoints = await getApiEndpointsForApplication(userId, applicationId);

        res.status(200).json({
            message: "API endpoints retrieved successfully.",
            data: apiEndpoints,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};

// Create a new API endpoint for the specified application
export const createApiEndpointHandler = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from request
        const userName = req.user.first_name; // Get the user name from request
        const apiEndpointData = req.body;

        // Create the new API endpoint
        const newApiEndpoint = await createApiEndpoint(userId, apiEndpointData, userName);

        res.status(201).json({
            message: "API endpoint created successfully.",
            data: newApiEndpoint,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};

export const populateApiEndpointHandler = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from request
        const email = req.user.email; // Get the user email from request
        const apiEndpointData = req.body;

        // Create the new API endpoint
        const newApiEndpoint = await populateApiEndpoint(userId, apiEndpointData, email);

        res.status(201).json({
            message: "Population triggered successfully.",
            data: newApiEndpoint,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};

// Get a specific API endpoint by ID (only if it belongs to the user's accessible application)
export const getApiEndpointByIdHandler = async (req, res) => {
    const { id } = req.params;

    try {
        const userId = req.user.id;

        // Get the specific API endpoint
        const apiEndpoint = await getApiEndpointById(userId, id);

        res.status(200).json({
            message: "API endpoint retrieved successfully.",
            data: apiEndpoint,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};

// Update a specific API endpoint (only if it belongs to the user's accessible application)
export const updateApiEndpointHandler = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const userId = req.user.id;

        // Update the API endpoint
        const updatedApiEndpoint = await updateApiEndpoint(userId, id, updatedData);

        res.status(200).json({
            message: "API endpoint updated successfully.",
            data: updatedApiEndpoint,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};

// Delete a specific API endpoint (only if it belongs to the user's accessible application)
export const deleteApiEndpointHandler = async (req, res) => {
    const { id } = req.params;

    try {
        const userId = req.user.id;

        // Delete the API endpoint
        const deletedApiEndpoint = await deleteApiEndpoint(userId, id);

        res.status(200).json({
            message: "API endpoint deleted successfully.",
            data: deletedApiEndpoint,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};
