import express from "express";
import { validateObjectId } from "../middlewares/validate-object-id.js";
import {getAllBillingInfo,createBillingInfo,getBillingInfoById,updateBillingInfo,deleteBillingInfo} from "../controllers/billing-info-controller.js";

const billingInfoRouter = express.Router();

//Get All Billing Info
billingInfoRouter.get("/",getAllBillingInfo);

//Create Billing Info
billingInfoRouter.post("/", createBillingInfo);

//Getting Billing Info by ID
billingInfoRouter.get("/:id", validateObjectId, getBillingInfoById);

//Updating the billing Info by ID
billingInfoRouter.put("/:id", validateObjectId, updateBillingInfo);

//Deleting the billing Info by ID
billingInfoRouter.delete("/:id", validateObjectId, deleteBillingInfo);

export default billingInfoRouter;