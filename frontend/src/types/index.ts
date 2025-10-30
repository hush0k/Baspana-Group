export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    date_of_birth: string;
    phone_number: string;
    city: string;
    avatar_url: string;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}