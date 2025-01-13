import { getApplicationsForUser, getApplicationByIdForUser, createApplicationForUser, updateApplicationForUser, deleteApplicationForUser } from "../services/application-service.js";

// Get all applications for the authenticated user
export const getAllApplications = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from request

        // Get all applications for the user
        const applications = await getApplicationsForUser(userId);

        res.send({
            message: "Applications retrieved successfully",
            data: applications,
        });
    } catch (error) {
        res.status(error.statusCode || 500).send(error);
    }
};

// Get a specific application by ID for the authenticated user
export const getApplicationById = async (req, res) => {
    try {
        const userId = req.user.id;
        const applicationId = req.params.id;

        // Check if the user has access to the requested application
        const application = await getApplicationByIdForUser(userId, applicationId);

        res.send({
            message: "Application retrieved successfully",
            data: application,
        });
    } catch (error) {
        res.status(error.statusCode || 500).send(error);
    }
};

// Create a new application for the authenticated user
export const createApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const userName = req.user.first_name;
        const applicationData = req.body;

        // Create the new application
        const newApplication = await createApplicationForUser(userId, applicationData, userName);

        res.status(201).send({
            message: "Application created successfully",
            data: newApplication,
        });
    } catch (error) {
        res.status(error.statusCode || 500).send(error);
    }
};

// Update a specific application by ID for the authenticated user
export const updateApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const userName = req.user.first_name;
        const applicationId = req.params.id;
        const updatedData = req.body;

        // Update the application
        const updatedApplication = await updateApplicationForUser(
            userId,
            applicationId,
            updatedData,
            userName
        );

        res.send({
            message: "Application updated successfully",
            data: updatedApplication,
        });
    } catch (error) {
        res.status(error.statusCode || 500).send(error);
    }
};

// Delete a specific application by ID for the authenticated user
export const deleteApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const applicationId = req.params.id;

        // Delete the application
        const deletedApplication = await deleteApplicationForUser(
            userId,
            applicationId
        );

        res.send({
            message: "Application deleted successfully",
            data: deletedApplication,
        });
    } catch (error) {
        res.status(error.statusCode || 500).send(error);
    }
};
