import { AxiosError } from 'axios'

export namespace AuthTypes {
    export interface LoginUser  {
        login: string
        password: string
    }
    export interface RegisterUser  {
        email: string;
        phone: string;
        password: string;
        password_confirm: string;
    }
    export interface PasswordReset  {
        email: string
    }
    export interface ActivateUser  {
        email: string | null
        activation_code: string
    };

    export interface PasswordResetConfirm  {
        pin_code: string
        new_password_confirm: string
        new_password: string
    };

    export interface User {
        id: number
        email: string
        phone_number: string
        name: string
        avatar: string | null
    }

    export type ErrorMessage = Error | AxiosError | null;

    export interface Tokens {
        refresh: string;
        access: string;
    }
    export interface AuthState {
        user: User | null;
        tokens: Tokens | null;
        isValidToken: boolean;
        error: ErrorMessage;
        isAuth: boolean;
    }
}
