import { Activity } from "../model/activity";
import { Interest } from "../model/interest";

export type UserInput = {
    id?: number;
    firstName: string;
    lastName: string;
    phoneNumber: PhoneNumber;
    email: string;
    password: string;
    gender: Gender;
};

export type Gender = 'male' | 'female';
export type PhoneNumber = { countryCode: string, number: string };

export type UserSummary = {
    firstName: string;
    lastName: string;
    email: string;
    interests: Interest[];
    gender: Gender;
};

export type Location = {
    longitude: String;
    latitude: String;
};

export type PostSummary = {
    id?: number,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    time: string,
    location: Location,
    activity: Activity,
    creator: UserSummary,
    participants: UserSummary[],
    peopleNeeded: number,
    preferredGender: Gender | 'any';
};




export type PostInput = {
    id?: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    time: string;
    location: Location;
    activity: Activity;
    creator?: UserSummary;
    participants?: UserSummary[];
    peopleNeeded: number;
    preferredGender: Gender | 'any';
};