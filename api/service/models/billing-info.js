import mongoose from "mongoose";

//Creating the billing info schema
const billingInfoSchema = new mongoose.Schema(
    {
        user_id: {
             type: mongoose.Schema.Types.ObjectId, 
             ref: 'User', 
             required: true 
        },
        payment_method: {
            type: String,
            required: true
        },
        card_holder_name: {
            type: String,
            required: true
        },
        card_number: {
            type: String,
            required: true
        },
        card_type: {
            type: String,
            required: true
        },
        primary : {
            type: Boolean,
            default: false
        },
        exp_date: {
            type: String,
            required: true
        },
        billing_address: {
            type: String,
            required: true
        },
        // subscription_id: {
        //     type: String,
        //     required: true
        // },
        // subscription_start_date: {
        //     type: Date,
        //     required: true
        // },
        // subscription_end_date: {
        //     type: Date,
        //     required: true
        // },
        amount: {
            type: mongoose.Decimal128,
            requrired: true
        },
        currency: {
            type: String,
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now, // Automatically set the creation timestamp
        },
        updated_at: {
            type: Date,
            default: Date.now, // Automatically set the creation timestamp
        },

    }
);

//Creating the model
const billingInfoModel = mongoose.model('billing-info',billingInfoSchema);
export default billingInfoModel;