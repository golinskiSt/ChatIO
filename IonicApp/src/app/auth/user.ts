export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    comments: string[];
    joinDate: Date;
    description: string;
}
