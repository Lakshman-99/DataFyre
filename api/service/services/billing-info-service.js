// services/billingInfoService.js
import BillingInfo from "../models/billing-info.js";

// Fetch all billing info for a specific user
export const findAllBillingInfo = async (userId) => {
    return await BillingInfo.find({ user_id: { $in: userId } });
};

// Fetch billing info by ID
export const findBillingInfoById = async (billingId) => {
    return await BillingInfo.findById(billingId);
};

// Create new billing info
export const createBillingInfo = async (billingInfoData) => {
    const newBillingInfo = new BillingInfo(billingInfoData);
    return await newBillingInfo.save();
};

// Update billing info by ID
export const updateBillingInfoById = async (billingInfoId, updateData) => {
    return await BillingInfo.findByIdAndUpdate(
        billingInfoId,
        updateData,
        { new: true }
    );
};

export const findPrimaryBillingInfo = async (userId) => {
    try {
        const primaryBillingInfo = await BillingInfo.find({ user_id: userId, primary: true });
        return primaryBillingInfo;
    } catch (error) {
        console.error("Error in findPrimaryBillingInfo:", error);
        throw error;
    }
};

// Delete billing info by ID
export const deleteBillingInfoById = async (billingInfoId) => {
    return await BillingInfo.findByIdAndDelete(billingInfoId);
};