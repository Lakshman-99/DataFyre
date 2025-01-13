import PopulationLogs from '../models/dashboard.js';
import Application from '../models/application.js';
import UserApplicationMapping from '../models/user-application-mapping.js';
import moment from 'moment';
import APIEndpoints from '../models/api-endpoint.js';

// Helper function to get the applications associated with a user
// Get applications mapped to a user by finding user-application mappings and fetching corresponding applications
const getUserApplications = async (userId) => {
    const mappings = await UserApplicationMapping.find({ user_id: userId });
    const applicationIds = mappings.map(mapping => mapping.application_id);
    return Application.find({ _id: { $in: applicationIds } });
};

// 1. Overview: Returns total, success, failure, and total applications
export const getOverviewData = async (userId) => {
    try {
        const userApplications = await getUserApplications(userId); 
        
        const applicationIds = userApplications.map(app => app._id);
        const apiEndpoints = await APIEndpoints.find({
            application_id: { $in: applicationIds }
        });

        const apiEndpointIds = apiEndpoints.map(endpoint => endpoint._id);

        // Aggregate population logs for total, success, and failure counts
        const populationSummary = await PopulationLogs.aggregate([
            { $match: { api_endpoint_id: { $in: apiEndpointIds } } },
            { $group: { 
                _id: null, 
                total: { $sum: "$records_to_process" }, 
                success: { $sum: "$success_count" },
                failure: { $sum: "$failure_count" }
            }}
        ]);

        const totalCount = populationSummary[0] || { total: 0, success: 0, failure: 0 };

        // Get total applications
        const totalApplications = userApplications.length;

        return {
            total: totalCount.total,
            success: totalCount.success,
            failure: totalCount.failure,
            total_applications: totalApplications
        };

    } catch (error) {
        throw new Error("Error fetching overview data");
    }
};

// 2. Population Timeline: Return counts for the given key (month, week, month_with_success_failure, week_with_success_failure)
export const getPopulationTimelineData = async (userId, key) => {
    // Get user's accessible applications
    const userApplications = await getUserApplications(userId);

    const applicationIds = userApplications.map(app => app._id);
    const apiEndpoints = await APIEndpoints.find({
        application_id: { $in: applicationIds }
    });

    const apiEndpointIds = apiEndpoints.map(endpoint => endpoint._id);

    // Create a filter for the year
    const dateRangeFilter = {
        api_endpoint_id: { $in: apiEndpointIds },
        started_at: { $gte: moment().startOf('year').toDate(), $lte: moment().endOf('year').toDate() }
    };

    let aggregationPipeline = [];

    try {
        // Initial match and project stages
        aggregationPipeline.push(
            { $match: dateRangeFilter },
            { $project: { started_at: 1, records_to_process: 1, success_count: 1, failure_count: 1 }}
        );

        // Define the group stage based on the key
        if (key === "month") {
            aggregationPipeline.push({
                $group: {
                    _id: { $month: "$started_at" },
                    total_records: { $sum: "$records_to_process" }
                }
            });
        } else if (key === "month_with_success_failure") {
            aggregationPipeline.push({
                $group: {
                    _id: { $month: "$started_at" },
                    success: { $sum: "$success_count" },
                    failure: { $sum: "$failure_count" }
                }
            });
        }

        // Sort the results by month
        aggregationPipeline.push({ $sort: { "_id": 1 } });

        // Execute aggregation pipeline
        const populationData = await PopulationLogs.aggregate(aggregationPipeline);

        let result = key === "month" ? new Array(12).fill(0) : { success: new Array(12).fill(0), failure: new Array(12).fill(0) };

        // Process the data
        populationData.forEach(item => {
            const monthIndex = item._id - 1;  // because months are 1-based in $month and arrays are 0-based
            if (key === "month") {
                result[monthIndex] = item.total_records;
            } else if (key === "month_with_success_failure") {
                result.success[monthIndex] = item.success;
                result.failure[monthIndex] = item.failure;
            }
        });

        return result;

    } catch (error) {
        throw new Error("Error fetching population timeline data");
    }
};
// 3. Population By Application: Sum up population logs per application
export const getPopulationByApplicationData = async (userId) => {
    try {
        const userApplications = await getUserApplications(userId);

        // Fetch population logs grouped by application and API endpoint
        // Aggregate population logs by application
        const populationByApplication = await PopulationLogs.aggregate([
            // Match logs for user's applications
            { $match: { api_endpoint_id: { $in: userApplications.map(app => app._id) } } },
            // Group by API endpoint and sum metrics
            { $group: { 
                _id: "$api_endpoint_id", 
                totalRecords: { $sum: "$records_to_process" },
                success_count: { $sum: "$success_count" },
                failure_count: { $sum: "$failure_count" },
            }},
            // Join with applications collection
            { $lookup: {
                from: "applications",
                localField: "_id",
                foreignField: "_id",
                as: "application_details"
            }},
            // Unwind the joined application details
            { $unwind: "$application_details" }
        ]);

        // Format data by application name
        const groupedData = {};
        populationByApplication.forEach(item => {
            const appName = item.application_details.name;
            if (!groupedData[appName]) {
                groupedData[appName] = 0;
            }
            groupedData[appName] += item.totalRecords;
        });

        return groupedData;

    } catch (error) {
        throw new Error("Error fetching population by application");
    }
};
// 4. Population Logs: Return all population logs for the user, sorted in descending order by `started_at`
export const getPopulationLogsData = async (userId) => {
    try {
        const userApplications = await getUserApplications(userId);

        const applicationIds = userApplications.map(app => app._id);
        const apiEndpoints = await APIEndpoints.find({
            application_id: { $in: applicationIds }
        });
    
        const apiEndpointIds = apiEndpoints.map(endpoint => endpoint._id);

        // Fetch population logs for the user's accessible applications
        const populationLogs = await PopulationLogs.find({
            api_endpoint_id: { $in: apiEndpointIds }
        }).populate("api_endpoint_id", "name").sort({ started_at: -1 }); // Sort by descending `started_at`

        return populationLogs;

    } catch (error) {
        throw new Error("Error fetching population logs");
    }
};

// 5. Population By Status: Count population logs by their status (Pending, In Progress, Completed, Failed)
export const getPopulationByStatusData = async (userId, status) => {
    try {
        const userApplications = await getUserApplications(userId);

        // Count population logs by status
        const populationByStatus = await PopulationLogs.aggregate([
            { $match: { 
                api_endpoint_id: { $in: userApplications.map(app => app._id) },
                status: status,
            }},
            // Group by status and calculate totals
            { $group: { 
                _id: "$status", 
                totalRecords: { $sum: "$records_to_process" },
                success_count: { $sum: "$success_count" },
                failure_count: { $sum: "$failure_count" },
            }}
        ]);

        // Format results into an object
        const result = {};
        // Map aggregation results to a formatted object
        populationByStatus.forEach(item => {
            result[item._id] = {
                totalRecords: item.totalRecords,
                success_count: item.success_count,
                failure_count: item.failure_count
            };
        });

        return result;

    } catch (error) {
        throw new Error("Error fetching population by status");
    }
};