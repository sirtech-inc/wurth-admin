export interface AccountUser {
    id: number;
    name: string;
    email: string;
    status: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export interface AccountUserUpdatePassword {
    current_password: string;
    new_password: string;
    confirm_password: string;
}