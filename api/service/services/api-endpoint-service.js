import APIEndpoints from "../models/api-endpoint.js";
import PopulationLogs from "../models/dashboard.js";
import AppError from "../utils/app-error.js";
import Application from "../models/application.js";
import UserApplicationMapping from "../models/user-application-mapping.js";
import bree from "../bree.js";
import path from 'path';

// Get all API endpoints associated with a user's accessible applications
export const getApiEndpointsForApplication = async (userId, applicationId) => {
    // Check if the user has access to the application
    const userAppMapping = await UserApplicationMapping.findOne({
        user_id: userId,
        application_id: applicationId,
    });

    if (!userAppMapping) {
        throw new AppError(
            "User does not have access to this application.",
            403
        );
    }

    // Fetch all API endpoints related to the application
    const apiEndpoints = await APIEndpoints.find({
        application_id: applicationId,
    }).populate("created_by", "first_name");

    // Format the response to include created_by as a string
    const formattedApiEndpoints = apiEndpoints.map((endpoint) => ({
        ...endpoint.toObject(),
        created_by: endpoint.created_by.first_name,
    }));

    return formattedApiEndpoints;
};

// Create a new API endpoint for a specified application
export const createApiEndpoint = async (userId, apiEndpointData, userName) => {
    const {
        name,
        route,
        method,
        input_data_mapping,
        headers,
        description,
        auth_type,
        application_id,
    } = apiEndpointData;

    // Check if the user has access to the application
    const userAppMapping = await UserApplicationMapping.findOne({
        user_id: userId,
        application_id,
    });

    if (!userAppMapping) {
        throw new AppError(
            "User does not have access to this application.",
            403
        );
    }

    // Create the new API endpoint
    const newApiEndpoint = new APIEndpoints({
        application_id,
        name,
        route,
        method,
        input_data_mapping,
        headers,
        description,
        auth_type,
        created_by: userId,
        updated_by: userId,
    });

    await newApiEndpoint.save();

    const formattedApiEndpoint = {
        ...newApiEndpoint.toObject(),
        created_by: userName,
        updated_by: userName,
    };

    return formattedApiEndpoint;
};

// Get a specific API endpoint by ID
export const getApiEndpointById = async (userId, apiEndpointId) => {
    // Fetch the API endpoint
    const apiEndpoint = await APIEndpoints.findById(apiEndpointId)
        .populate("application_id")
        .populate("created_by", "first_name");

    if (!apiEndpoint) {
        throw new AppError("API endpoint not found.", 404);
    }

    // Check if the user has access to the application
    const userAppMapping = await UserApplicationMapping.findOne({
        user_id: userId,
        application_id: apiEndpoint.application_id._id,
    });

    if (!userAppMapping) {
        throw new AppError(
            "User does not have access to this application.",
            403
        );
    }

    const app = await Application.findByIdAndUpdate(
        apiEndpoint.application_id._id, // The ID of the application to update
        { $inc: { entity_count: 1 } },   // Increment the entity_count field by 1
        { new: true }                  
    );
    
    const formattedApiEndpoints = {
        ...apiEndpoint.toObject(),
        created_by: endpoint.created_by.first_name,
    };
    
    await app.save();

    return formattedApiEndpoints;
};

// Update a specific API endpoint
export const updateApiEndpoint = async (userId, apiEndpointId, updatedData) => {
    // Fetch the API endpoint
    const apiEndpoint = await APIEndpoints.findById(apiEndpointId).populate(
        "created_by",
        "first_name"
    );

    if (!apiEndpoint) {
        throw new AppError("API endpoint not found.", 404);
    }

    // Check if the user has access to the application
    const userAppMapping = await UserApplicationMapping.findOne({
        user_id: userId,
        application_id: updatedData.application_id,
    });

    if (!userAppMapping) {
        throw new AppError(
            "User does not have access to this application.",
            403
        );
    }

    // Update the API endpoint
    Object.assign(apiEndpoint, updatedData, { updated_by: userId });
    await apiEndpoint.save();

    const formattedApiEndpoints = {
        ...apiEndpoint.toObject(),
        created_by: apiEndpoint.created_by.first_name,
    };

    return formattedApiEndpoints;
};

// Delete a specific API endpoint
export const deleteApiEndpoint = async (userId, apiEndpointId) => {
    // Fetch the API endpoint
    const apiEndpoint = await APIEndpoints.findById(apiEndpointId).populate(
        "application_id"
    );

    if (!apiEndpoint) {
        throw new AppError("API endpoint not found.", 404);
    }

    // Check if the user has access to the application
    const userAppMapping = await UserApplicationMapping.findOne({
        user_id: userId,
        application_id: apiEndpoint.application_id._id,
    });

    if (!userAppMapping) {
        throw new AppError(
            "User does not have access to this application.",
            403
        );
    }

    const app = await Application.findByIdAndUpdate(
        apiEndpoint.application_id._id, // The ID of the application to update
        { $inc: { entity_count: -1 } },   // Decrement the entity_count field by 1
        { new: true }                  
    );

    // Delete the API endpoint
    await apiEndpoint.deleteOne();
    await app.save();

    return apiEndpoint;
};

// Populate API endpoint data
export const populateApiEndpoint = async (userId, apiEndpointData, email) => {
    const { api_endpoint_id, records_to_process, language, is_xss_mode } =
        apiEndpointData;

    const apiEndpoint = await APIEndpoints.findById(api_endpoint_id);

    // Check if the user has access to the application
    const userAppMapping = await UserApplicationMapping.findOne({
        user_id: userId,
        application_id: apiEndpoint.application_id,
    });

    if (!userAppMapping) {
        throw new AppError(
            "User does not have access to this application.",
            403
        );
    }

    // Create the new API endpoint
    const populationLog = new PopulationLogs({
        api_endpoint_id,
        records_to_process,
        language,
        is_xss_mode,
        started_by: userId,
    });

    await populationLog.save();

    const jobName = `populate-service-${new Date().getTime()}`;

    await bree.add({
        name: jobName,
        path: path.resolve('./service/jobs/populate-service.js'),
        data: {
            api_endpoint_id,
            populationLogId: populationLog._id.toString(),
            email, 
            records_to_process,
            language,
            is_xss_mode,
        },
    });

    // Now start the job after it has been added
    await bree.start(jobName);

    return populationLog;
};
