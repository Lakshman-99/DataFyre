import BillingInfo from "../models/billing-info.js";
import * as billingInfoService from "../services/billing-info-service.js";

//Getting all the billingInfo for the user, User might have different addresses stored
export const getAllBillingInfo = async (req, res) => {
    try{
        const userId = req.user.id; // Assuming the user ID is available in req.user after authentication
        const billingInfoRes = await billingInfoService.findAllBillingInfo(userId);
        res.send({
            message: "Billing Info Details retrieved successfully",
            data: billingInfoRes,
        });
    }
    catch(error){
        console.error(error);
        res.status(500).send({
            message: "Internal Server Error",
            errors: [error.message],
        });
    }
};

//Getting billinginfo of a particular Id
export const getBillingInfoById = async (req, res) => {
    try{
        const billing_id = req.params.id;
        const billingInfoRes = await billingInfoService.findBillingInfoById(billing_id);
        res.send({
            message: "Billing Info Details retrieved successfully",
            data: billingInfoRes,
        });
    }
    catch(error)
    {
        console.error(error);
        res.status(500).send({
            message: "Internal Server Error",
            errors: [error.message],
        });
    }
};

//Creating the billingInfo
export const createBillingInfo = async (req, res) => {
    try{
        const userId = req.user.id; // Get the user ID from the request

        const {
            user_id,
            payment_method,
            card_number,
            card_holder_name,
            card_type,
            primary,
            exp_date,
            billing_address,
            amount,
            currency,
        } = req.body

        const billingInfoData = {
            user_id: userId,
            payment_method,
            card_number,
            card_holder_name,
            card_type,
            primary,
            exp_date,
            billing_address,
            amount,
            currency,
            created_by: userId,
            last_updated_by: userId,
            created_at: new Date(),
            last_updated_at: new Date(),
        };

        // If the new billing info is set as primary
        if (primary) {
            // Find all existing primary billing info for the user
            const existingPrimaryBillingInfo = await billingInfoService.findPrimaryBillingInfo(userId);

            // Update all existing primary billing info to non-primary
            for (const billingInfo of existingPrimaryBillingInfo) {
                await billingInfoService.updateBillingInfoById(billingInfo._id, { primary: false });
            }
        }

        const newBillingInfo = await billingInfoService.createBillingInfo(billingInfoData);

        res.status(201).send({
            message: "Billing Info created successfully",
            data: newBillingInfo,
        });
    }
    catch(error)
    {
        console.error(error);
        res.status(500).send({
            message: "Internal Server Error",
            errors: [error.message],
        });
    }
};

//Updating the billing Info of a particular Id
export const updateBillingInfo = async (req, res) => {
    try{
        const userId = req.user.id; // Get user ID from request
        const billing_info_id = req.params.id;

        const { primary } = req.body;

        // If updating to primary
        if (primary) {
            // Find all existing primary billing info for the user
            const existingPrimaryBillingInfo = await billingInfoService.findPrimaryBillingInfo(userId);

            // Update all existing primary billing info to non-primary
            for (const billingInfo of existingPrimaryBillingInfo) {
                if (billingInfo._id.toString() !== billing_info_id) {
                    await billingInfoService.updateBillingInfoById(billingInfo._id, { primary: false });
                }
            }
        }

        const updatedBillingInfo = await billingInfoService.updateBillingInfoById(
            billing_info_id,
            {
                ...req.body,
                last_updated_by: userId,
                last_updated_at: new Date(),
            }
        );

        if (!updatedBillingInfo) {
            return res.status(404).send({
                message: "Billing Info not found",
                data: null,
            });
        }

        res.send({
            message: "BillingInfo updated successfully",
            data: updatedBillingInfo,
        });
    }
    catch(error)
    {
        console.error(error);
        res.status(500).send({
            message: "Internal Server Error",
            errors: [error.message],
        });
    }
}

//Deleting the billing Info of a particular Id
export const deleteBillingInfo = async (req, res) => {
    try{
        const userId = req.user.id; // Get user ID from request
        const billing_info_id = req.params.id;

        const deletedBillingInfo = await billingInfoService.deleteBillingInfoById(billing_info_id);

        if (!deletedBillingInfo) {
            return res.status(404).send({
                message: "Application not found",
                data: null,
            });
        }

        res.send({
            message: "Billing Info deleted successfully",
            data: deletedBillingInfo,
        });
    }
    catch(error)
    {
        console.error(error);
        res.status(500).send({
            message: "Internal Server Error",
            errors: [error.message],
        });
    }
}
