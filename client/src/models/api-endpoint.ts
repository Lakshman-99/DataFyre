export interface APIEndpoints {
    _id?: string;
    application_id: string; // This can be an ObjectId or the Application object itself
    name: string;
    route: string;
    method: "POST" | "PUT" | "DELETE";
    input_data_mapping: string; // Ensure it’s a JSON string
    headers: string; // Ensure it’s a JSON string
    description?: string; // Description must not exceed 250 words
    auth_type: "Bearer" | "APIKey" | "None";
    created_at?: Date;
    updated_at?: Date;
    created_by?: string; // Can be a reference to a User or an ObjectId
    updated_by?: string; // Can be a reference to a User or an ObjectId
}

export interface TriggerPopulation {
    api_endpoint_id: string, 
    records_to_process: number,
    language: string,
    is_xss_mode: boolean
}