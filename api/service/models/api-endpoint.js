import mongoose from "mongoose";
import PopulationLogs from "./dashboard.js";

const APIEndpointsSchema = new mongoose.Schema(
    {
        application_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
            required: true,
        },
        name: { type: String, required: true },
        route: { type: String, required: true },
        method: {
            type: String,
            enum: ["POST", "PUT", "DELETE"],
            required: true,
        },
        input_data_mapping: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    try {
                        // Try to parse the string as JSON to ensure it's a valid JSON string
                        JSON.parse(value);
                        return true;
                    } catch (e) {
                        return false; // Invalid JSON string
                    }
                },
                message: "Input data mapping must be a valid JSON string.",
            },
        },
        headers: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    try {
                        // Try to parse the string as JSON to ensure it's a valid JSON string
                        JSON.parse(value);
                        return true;
                    } catch (e) {
                        return false; // Invalid JSON string
                    }
                },
                message: "Input data mapping must be a valid JSON string.",
            },
        },
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
        auth_type: {
            type: String,
            enum: ["Bearer", "APIKey", "None"],
            required: true,
        },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

APIEndpointsSchema.pre('deleteOne', async function (next) {
    try {
        // Delete all PopulationLogs associated with this API Endpoint
        await PopulationLogs.deleteMany({ api_endpoint_id: this._id });

        // Proceed to the next middleware or operation
        next();
    } catch (error) {
        next(error);
    }
});

APIEndpointsSchema.pre('deleteMany', async function (next) {
    try {
        const filter = this.getFilter();

        const apiEndpoints = await APIEndpoints.find(filter);

        if (apiEndpoints.length === 0) {
            return next();
        }

        // Delete all PopulationLogs associated with the API Endpoints being deleted
        await PopulationLogs.deleteMany({
            api_endpoint_id: { $in: apiEndpoints.map(endpoint => endpoint._id) },
        });

        next();
    } catch (error) {
        next(error);
    }
});


const APIEndpoints = mongoose.model("APIEndpoints", APIEndpointsSchema);

export default APIEndpoints;