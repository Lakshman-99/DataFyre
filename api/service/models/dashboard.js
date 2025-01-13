import mongoose from "mongoose";

// Schema for tracking API population logs
const PopulationLogsSchema = new mongoose.Schema({
    api_endpoint_id: { 
        type: mongoose.Schema.Types.ObjectId, // Reference to API endpoint
        ref: "APIEndpoints",
        required: true,
    }, 
    records_to_process: { type: Number, default: 0, required: true }, // Total records count
    language: { type: String, default: 'en', required: true }, // Language for error messages
    is_xss_mode: { type: Boolean, default: false }, // XSS mode flag
    status: { 
        type: String, 
        enum: ['In Progress', 'Completed', 'Failed'], 
        default: 'In Progress' 
    }, // Current status of population
    success_count: { type: Number, default: 0 }, // Successfully processed records
    failure_count: { type: Number, default: 0 }, // Failed records count
    failure_responses: { type: String, default: '' }, // Error messages
    execution_time: { type: Number, default: 0 }, // Actual processing time
    started_at: { type: Date, default: Date.now }, // Start time of population
    stopped_at: { type: Date }, // End time of population
    started_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who initiated
    stopped_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who stopped
}, { timestamps: true }); 

// Model for population logs
const PopulationLogs = mongoose.model('PopulationLogs', PopulationLogsSchema);

export default PopulationLogs;