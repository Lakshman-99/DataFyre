import mongoose from "mongoose";
import cors from "cors";
import express from "express";

import requestLogger from "./middlewares/logger.js";
import rateLimiter from "./middlewares/rate-limiter.js";
import securityHeaders from "./middlewares/security.js";
import responseHandler from "./middlewares/response-handler.js";
import initializeRouters from "./routers/index.js";
import bree from "./bree.js";

const initialize = (app) => {
    const corsOptions = {
        origin: process.env.ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    };


    // Middlewares Setup
    app.use(requestLogger); // Log HTTP requests
    app.use(securityHeaders); // Apply security headers globally
    app.use(cors(corsOptions)); // Enable CORS with specified options
    app.use(express.json({ limit: '100mb' })); // Parse JSON bodies

    app.use(express.urlencoded({ limit: '100mb', extended: true })); // Parse URL-encoded bodies

    // Mongoose Connection
    mongoose
        .connect(process.env.MONGO_CONNECTION)
        .then(() => console.log("Connected to MongoDB"))
        .catch((error) => console.error("Error connecting to MongoDB:", error));

    // Rate limiter (globally applied)
    app.use(rateLimiter);
    app.use(responseHandler); // Response Handler

    // Start Bree
    bree.start();

    // Event Listeners
    bree.on("worker created", (name) => {
        console.log(`Worker for job "${name}" created.`);
    });

    bree.on("worker deleted", (name) => {
        console.log(`Worker for job "${name}" deleted.`);
    });

    // Routers Initialization
    initializeRouters(app);
};

export default initialize;
