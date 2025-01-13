import mongoose from "mongoose";
import UserApplicationMapping from "./user-application-mapping.js";
import APIEndpoints from "./api-endpoint.js";

const ApplicationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    // Split the description by spaces and check the word count
                    const wordCount = value.split(/\s+/).length;
                    return wordCount <= 250; // Limit to 250 words
                },
                message: "Description must not exceed 250 words.",
            },
        },
        icon_url: { 
            type: String, 
            validate: {
                validator: function(value) {
                    // Allow empty string or valid URL
                    return value === '' || /^https?:\/\//.test(value);
                },
                message: 'Invalid URL format or empty value is not allowed',
            },
        },
        api_endpoint_url: {
            type: String,
            required: true,
            validate: /^https?:\/\//,
        },
        api_key: { type: String, required: true },
        environment: {
            type: String,
            enum: ["development", "staging", "production"],
            required: true,
        },
        type: { type: String, enum: ["public", "private"], required: true },
        entity_count: { type: Number, default: 0 },
        created_at: { type: Date, default: Date.now },
        last_updated_at: { type: Date, default: Date.now },
        created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        last_updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        collaborations: {
            type: [
                {
                    email: {
                        type: String,
                        required: true,
                        lowercase: true, // Convert to lowercase before saving
                        trim: true, // Remove leading/trailing whitespace
                        match: [
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email regex
                            "Please provide a valid email address", // Custom error message
                        ],
                    },
                    role: {
                        type: [String], // An array of roles
                        enum: ["view", "add", "edit", "delete"], // Possible roles
                        required: true,
                    },
                    is_invite_accepted: { type: Boolean, default: false }, // Default to false
                },
            ],
            validate: {
                validator: function (value) {
                    // Validate that the array length does not exceed 5
                    return value.length <= 5;
                },
                message: "A maximum of 5 collaborators are allowed.",
            },
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "last_updated_at" } }
);

// Middleware to delete related UserApplicationMapping when an application is deleted
ApplicationSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    // This will delete all user-application mappings related to the application
    await UserApplicationMapping.deleteMany({ application_id: this._id });
    await APIEndpoints.deleteMany({ application_id: this._id });
    next();
});

// Middleware to delete related UserApplicationMapping and APIEndpoints when multiple applications are deleted
ApplicationSchema.pre('deleteMany', async function (next) {
    const filter = this.getFilter();

    try {
        const applications = await Application.find(filter);

        // If no applications match, proceed without any deletions
        if (applications.length === 0) {
            return next();
        }

        // Delete all user-application mappings related to the applications being deleted
        await UserApplicationMapping.deleteMany({ application_id: { $in: applications.map(app => app._id) } });
        await APIEndpoints.deleteMany({ application_id: { $in: applications.map(app => app._id) } });

        next();
    } catch (error) {
        next(error);
    }
});


const Application = mongoose.model("Application", ApplicationSchema);

export default Application;
