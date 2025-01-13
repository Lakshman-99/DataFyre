export interface Collaboration {
    email: string;
    role: string[];
    is_invite_accepted: boolean;
}

export interface Application {
    _id: string; // MongoDB ObjectId as string
    name: string;
    description?: string;
    icon_url?: string;
    api_endpoint_url: string;
    api_key: string;
    environment: string; // Literal types for environment
    type: string; // Literal types for type
    entity_count: number;
    created_at: string; // ISO string date
    last_updated_at: string; // ISO string date
    created_by?: string;
    last_updated_by?: string;
    collaborations: Collaboration[];
    role?: string[];
}

export interface ApplicationFormData {
    applicationData?: Application; 
    isOpened: boolean; 
    onClose: () => void; 
    mode: string
}