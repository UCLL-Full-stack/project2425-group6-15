export type Gender = "male" | "female";

export type User = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: number; 
    password?: string;
    gender: Gender; 
    Interests: Interests[];
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



export type Interests = {
    id?: number;
    name: string;
}

export type Activity = {
    id?: number;
    name: string;
    description: string;
    date: Date;
    time: string;
    locationlatitude: string;
    locationlongitude: string;
    maxParticipants: number;
    participants: User[];
    creator: User;
};