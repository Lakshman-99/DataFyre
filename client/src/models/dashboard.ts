export interface TotalCountModel {
    total: number;
    success: number;
    failure: number;
    total_applications: number;
}

export interface PopulationLog {
    _id: string;
    api_endpoint_id: {
        _id: string;
        name: string;
    };
    records_to_process: number;
    language: string;
    is_xss_mode: boolean;
    status: 'In Progress' | 'Completed' | 'Failed';
    success_count: number;
    failure_count: number;
    failure_responses: string;
    execution_time: number;
    started_at: Date;
    stopped_at?: Date;
    started_by?: string;
    stopped_by?: string;
}