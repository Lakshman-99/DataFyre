
export interface BillingInfo {
    _id: string;
    user_id: string;                    // Reference to a User model (ObjectId type from mongoose)
    payment_method: string;                // Payment method (e.g., 'credit_card', 'paypal', etc.)
    card_number: string;  
    card_holder_name: string; 
    exp_date: string;     
    card_type: string;  
    primary: boolean;      
    billing_address: string;               // Billing address
    subscription_id: string;               // Unique identifier for the subscription
    subscription_start_date: Date;         // Subscription start date
    subscription_end_date: Date;           // Subscription end date
    amount: string;                         // Amount to be billed (using Decimal128 for precision)
    currency: string;                      // Currency used (e.g., 'USD', 'EUR')
    payment_status: string;                // Payment status (e.g., 'success', 'failed', 'pending')
    payment_method_token: string;          // Token used for the payment method
    transaction_history: string;           // Transaction history (possibly serialized JSON or logs)
    last_billed_at: Date;                 // Last billed date
    created_at: Date;                      // Creation date (auto-generated)
    updated_at: Date;                      // Update date (auto-generated)
}