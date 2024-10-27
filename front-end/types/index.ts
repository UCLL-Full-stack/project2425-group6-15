export type Gender = "male" | "female";

export type User = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: number; 
    password?: string;
    gender: Gender; 
};

export type RegisterUser = {
    firstName: string;
    lastName: string;
    email: string;
    phone: number; 
    password: string;
    gender: Gender; 
};
