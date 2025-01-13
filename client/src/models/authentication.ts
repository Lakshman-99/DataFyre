export interface SignInPayload {
    email: string;
    password: string;
    remember: boolean;
}

export interface SignUpData {
    first_name: string;
    last_name: string;
    email: string;
    hashed_password: string;
}
