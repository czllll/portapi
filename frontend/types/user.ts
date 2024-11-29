export interface User {
    userId: number;
    username: string;
    email: string;
    token: string;
    avatar: string | null;
    role: string;
    status: string | null;
}