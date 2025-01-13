import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import APIEndpoints from "../models/api-endpoint.js";
import Application from "../models/application.js";
import PopulationLogs from "../models/dashboard.js";
import generateFakeData from "../utils/generate-fake-data.js";
import { workerData, parentPort } from "worker_threads";
import { sendTaskCompletionEmail } from "../utils/email-templates.js";
import { stat } from "fs";

dotenv.config();

mongoose
.connect(process.env.MONGO_CONNECTION)
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("Error connecting to MongoDB:", error));

(async () => {
    let successCount = 0;
    let failedCount = 0;
    let errorLogs = [];
    const { api_endpoint_id, populationLogId, email, records_to_process, language, is_xss_mode } = workerData.job.data;

    try {
        // Validate input data
        if (!api_endpoint_id || !records_to_process || !language) {
            throw new Error("Invalid job data: Required fields are missing.");
        }

        // Fetch API endpoint details
        const apiEndpoint = await APIEndpoints.findById(api_endpoint_id).populate("application_id");
        if (!apiEndpoint) {
            throw new Error(`API Endpoint with id ${api_endpoint_id} not found.`);
        }

        const endpoint = `${apiEndpoint.application_id.api_endpoint_url}${apiEndpoint.route}`;
        const mapping = JSON.parse(apiEndpoint.input_data_mapping);
        const apiKey = apiEndpoint.application_id.api_key;
        let headers = apiEndpoint.headers;
        headers = headers.replace("$(token)", apiKey);
        headers = JSON.parse(headers);

        axios.defaults.headers.common = headers;

        // Loop to perform POST requests
        for (let i = 0; i < records_to_process; i++) {
            const fakeData = generateFakeData(mapping, language, is_xss_mode); // Fake data generation logic
            try {
                const response = await axios.post(endpoint, fakeData);

                if (response.status === 200 || response.status === 201) {
                    successCount++;
                    console.log(`Successfully posted data for record ${i + 1}`, fakeData);
                } else {
                    failedCount++;

                    const errorResp = {
                        url: response.config.url,
                        message: response.message,
                        status: response.status || "400",
                        code: response.code,
                    }
                    errorLogs.push({
                        data: fakeData,
                        errorResponse: errorResp,
                    });
                }
            } catch (error) {
                failedCount++;

                const errorResp = {
                    url: error.config.url,
                    message: error.message,
                    status: error.status || "400",
                    code: error.code,
                    
                }

                errorLogs.push({
                    data: fakeData,
                    errorResponse: errorResp,
                });
            }
        }

        const populationLog = await PopulationLogs.findById(populationLogId);
        const updatedPopulationLog = {
            status: "Completed",
            success_count: successCount,
            failure_count: failedCount,
            failure_responses: JSON.stringify(errorLogs),
            execution_time: Date.now() - populationLog.started_at,
            stopped_at: Date.now(),
            stopped_by: populationLog.started_by,
        }

        Object.assign(populationLog, updatedPopulationLog);
        await populationLog.save();

        sendTaskCompletionEmail(email, updatedPopulationLog);
    } catch (error) {
        const populationLog = await PopulationLogs.findById(populationLogId);
        const updatedPopulationLog = {
            status: "Failed",
            success_count: successCount,
            failure_count: failedCount,
            failure_responses: JSON.stringify(errorLogs),
            execution_time: Date.now() - populationLog.started_at,
            stopped_at: Date.now(),
        }

        Object.assign(populationLog, updatedPopulationLog);
        await populationLog.save();

        sendTaskCompletionEmail(email, updatedPopulationLog);
    }
})();