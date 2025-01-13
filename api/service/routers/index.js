import userRouter from "./user-router.js";
import applicationRouter from "./application-router.js";
import loginRouter from "./login-router.js";
import authenticate from "../middlewares/authenticate.js";
import apiEndpointRouter from "./api-endpoints-router.js";
import dashboardRouter from "./dashboard-router.js";
import billingInfoRouter from "./billing-info-router.js";
import verificationRouter from "./verification-router.js";

const initializeRouters = (app) => {
    app.use("/api/v1/login", loginRouter);
    app.use("/api/v1/users", userRouter);
    app.use("/api/v1/verifications", verificationRouter);
    app.use("/api/v1/applications", authenticate, applicationRouter); // Apply authentication middleware
    app.use("/api/v1/api_endpoints", authenticate, apiEndpointRouter); // Apply authentication middleware
    app.use('/api/v1/dashboard', authenticate, dashboardRouter);
    app.use("/api/v1/billing-info", authenticate, billingInfoRouter); // Apply authentication middleware
};

export default initializeRouters;
