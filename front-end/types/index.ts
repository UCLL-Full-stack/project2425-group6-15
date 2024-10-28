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
    id?: number;
    firstName: string;
    lastName: string;
    phoneNumber: PhoneNumber;
    email: string;
    password: string;
    gender: Gender;
};

export type PhoneNumber = {
    countryCode: string;
    number: string;
};


