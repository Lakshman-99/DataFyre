import * as DashboardService from '../services/dashboard-service.js';

// 1. Overview: Returns total, success, failure, and total applications
export const getOverview = async (req, res) => {
    // Get user ID from request
    const userId = req.user.id;

    try {
        // Fetch overview stats
        const overviewData = await DashboardService.getOverviewData(userId);

        res.status(200).json({
            message: "Dashboard overview retrieved successfully.",
            data: overviewData,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });    
    }
};

// 2. Population Timeline: Return counts for the given key (month, week, month_with_success_failure, week_with_success_failure)
export const getPopulationTimeline = async (req, res) => {
    // Get timeline key from query params and user ID from request
    const { key } = req.query;
    const userId = req.user.id;

    try {
        // Fetch timeline data based on key and user
        const timelineData = await DashboardService.getPopulationTimelineData(userId, key);

        res.status(200).json({
            message: "Population timeline retrieved successfully.",
            data: timelineData,
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });    
    }
};

// 3. Population By Application: Sum up population logs per application
export const getPopulationByApplication = async (req, res) => {
    // Get user ID from request
    const userId = req.user.id;

    try {
        // Fetch application population data
        const appData = await DashboardService.getPopulationByApplicationData(userId);

        res.status(200).json({
            message: "Population by application retrieved successfully.",
            data: appData,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};

// 4. Population Logs: Return all population logs for the user, sorted in descending order by `started_at`
export const getPopulationLogs = async (req, res) => {
    // Get user ID from request
    const userId = req.user.id;

    try {
        // Fetch population logs data for user
        const logsData = await DashboardService.getPopulationLogsData(userId);

        res.status(200).json({
            message: "Population logs retrieved successfully.",
            data: logsData,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};

// 5. Population By Status: Count population logs by their status (Pending, In Progress, Completed, Failed)
export const getPopulationByStatus = async (req, res) => {
    const userId = req.user.id;
    const { status } = req.query; // Status to filter by

    try {
        // Get population data filtered by status
        const statusData = await DashboardService.getPopulationByStatusData(userId, status);
        // Return success response with status data

        res.status(200).json({
            message: "Population by status retrieved successfully.",
            data: statusData,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });   
    }
};
