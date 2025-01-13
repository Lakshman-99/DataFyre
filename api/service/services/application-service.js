import Application from "../models/application.js";
import UserApplicationMapping from "../models/user-application-mapping.js";
import AppError from "../utils/app-error.js";
import { sendInvitationEmail } from "../utils/email-templates.js";
import { generateVerificationToken } from "../utils/jwt-verify.js";
import { getUserByEmailFromDb } from "./user-service.js";

// Get all applications for a specific user
export const getApplicationsForUser = async (userId) => {
    // Get all applications where the authenticated user is mapped
    const userApplications = await UserApplicationMapping.find({ user_id: userId });

    if (userApplications.length === 0) {
        throw new AppError("No applications found for this user", 404);
    }

    // Extract the application IDs and their corresponding roles
    const applicationRoleMap = userApplications.reduce((map, mapping) => {
        map[mapping.application_id] = mapping.role;
        return map;
    }, {});

    // Retrieve the actual applications
    const applications = await Application.find({ _id: { $in: Object.keys(applicationRoleMap) } }).populate("created_by").populate("last_updated_by");

    // Create applications with roles by augmenting the existing application object
    const applicationsWithRoles = applications.map(application => {
        const applicationIdStr = application._id.toString();
        const role = applicationRoleMap[applicationIdStr];

        const applicationWithRole = {
            ...application.toObject(), 
            created_by: application.created_by.first_name,
            last_updated_by: application.last_updated_by.first_name,
            role: role,  
        };

        return applicationWithRole;
    });

    return applicationsWithRoles;
};

// Get a specific application by ID for a user
export const getApplicationByIdForUser = async (userId, applicationId) => {
    // Check if the user has access to the requested application
    const userApplicationMapping = await UserApplicationMapping.findOne({
        user_id: userId,
        application_id: applicationId,
    });

    if (!userApplicationMapping) {
        throw new AppError("You do not have access to this application", 403);
    }

    // Fetch the application details
    let application = await Application.findById(applicationId);
    if (!application) {
        throw new AppError("Application not found", 404);
    }

    // Create a new object with the role dynamically added
    const applicationWithRole = {
        ...application.toObject(),
        created_by: application.created_by.first_name,
        last_updated_by: application.last_updated_by.first_name,
        role: userApplicationMapping.role,
    };

    return applicationWithRole;
};

// Create a new application for a user
export const createApplicationForUser = async (userId, applicationData, userName) => {
    const { collaborations } = applicationData; // Extract collaborators from the application data

    const newApplication = new Application({
        ...applicationData,
        created_by: userId,
        last_updated_by: userId,
        created_at: new Date(),
        last_updated_at: new Date(),
    });

    if(applicationData.type === "private") {
        // Send invitation emails to each collaborator before saving the application
        for (const collaborator of collaborations) {
            // Generate a verification token (you can modify this function as per your needs)
            const verificationToken = generateVerificationToken(collaborator.email, newApplication._id, userId, collaborator.role);

            // Send invitation email to the collaborator
            await sendInvitationEmail(collaborator.email, newApplication.name, userName, verificationToken);
        }
    }

    // Save the new application
    await newApplication.save();

    // Create the UserApplicationMapping for the user and application
    const userApplicationMapping = new UserApplicationMapping({
        user_id: userId,
        application_id: newApplication._id,
        owner_id: userId,
        role: ["view", "add", "edit", "delete"], // Owner has full access
    });

    // Save the mapping
    await userApplicationMapping.save();

    // Create the response object with dynamically added role
    const applicationWithRole = {
        ...newApplication.toObject(), 
        created_by: userName,
        last_updated_by: userName,
        role: userApplicationMapping.role,
    };

    return applicationWithRole;
};

// Update a specific application by ID for a user
export const updateApplicationForUser = async (userId, applicationId, updatedData, userName) => {
    // Check if the user has access to update the requested application
    const userApplicationMapping = await UserApplicationMapping.findOne({
        user_id: userId,
        application_id: applicationId,
    });

    if (!userApplicationMapping) {
        throw new AppError("You do not have access to this application", 403);
    }
    const { collaborations } = updatedData; // Extract collaborators from the application data

    // Update the application details
    const updatedApplication = await Application.findByIdAndUpdate(
        applicationId,
        {
            ...updatedData,
            last_updated_by: userId,
            last_updated_at: new Date(),
        },
        { new: true }
    ).populate("created_by", "first_name");

    if (!updatedApplication) {
        throw new AppError("Application not found", 404);
    }

    if(updatedData.type === "private") {
        // Send invitation emails to each collaborator before saving the application
        for (const collaborator of collaborations) {
            if(collaborator.is_verified) {
                continue;
            }
            // Generate a verification token (you can modify this function as per your needs)
            const verificationToken = generateVerificationToken(collaborator.email, updatedApplication._id, userId, collaborator.role);

            // Send invitation email to the collaborator
            await sendInvitationEmail(collaborator.email, updatedApplication.name, userName, verificationToken);
        }
    }

    // Create the response object with dynamically added role
    const applicationWithRole = {
        ...updatedApplication.toObject(), 
        role: userApplicationMapping.role,
        created_by: updatedApplication.created_by.first_name,
    };
    
    return applicationWithRole;
};

// Delete a specific application by ID for a user
export const deleteApplicationForUser = async (userId, applicationId) => {
    // Check if the user has access to delete the requested application
    const userApplicationMapping = await UserApplicationMapping.findOne({
        user_id: userId,
        application_id: applicationId,
    });

    if (!userApplicationMapping) {
        throw new AppError("You do not have access to this application", 403);
    }

    // Delete the application
    const deletedApplication = await Application.findById(applicationId);
    if (!deletedApplication) {
        throw new AppError("Application not found", 404);
    }

    await deletedApplication.deleteOne();

    return {};
};

export const createUserApplicationMapping = async (email, applicationId, ownerId, role) => {
    // Find the user by email
    const user = await getUserByEmailFromDb(email);

    // Get the application by ID
    const app = await getApplicationByIdForUser(ownerId, applicationId);

    const application = await Application.findById(applicationId);

    // Check if the user is already mapped to this application
    const existingMapping = await UserApplicationMapping.findOne({
        user_id: user._id,
        application_id: applicationId,
    });

    if (existingMapping) {
        throw new AppError("User is already mapped to this application", 400);
    }

    // Create the UserApplicationMapping for the user and application
    const userApplicationMapping = new UserApplicationMapping({
        user_id: user._id,
        application_id: applicationId,
        owner_id: ownerId,
        role: role,
    });

    // Iterate through the collaborations and accept the invitation if the email matches
    application.collaborations.forEach((collaborator) => {
        if (collaborator.email === email) {
            collaborator.is_invite_accepted = true; // Accept the invite
        }
    });

    // Save the updated application
    await application.save();

    // Save the mapping
    await userApplicationMapping.save();

};
