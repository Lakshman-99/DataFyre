import express from 'express';
import { getOverview, getPopulationTimeline, getPopulationByApplication, getPopulationLogs, getPopulationByStatus } from '../controllers/dashboard-controller.js';

// Create express router instance
const dashboardRouter = express.Router();

// Get overview statistics
dashboardRouter.get('/overview', getOverview);

// Get population data over time
dashboardRouter.get('/population_timeline', getPopulationTimeline);

// Get population data grouped by application type
dashboardRouter.get('/population_by_application', getPopulationByApplication);

// Get population activity logs
dashboardRouter.get('/population_logs', getPopulationLogs);

// Get population data grouped by status
dashboardRouter.get('/population_by_status', getPopulationByStatus);

export default dashboardRouter;