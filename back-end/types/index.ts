import { Activity } from "../model/activity";
import { Interest } from "../model/interest";
import { User } from "../model/user";

export type Gender = 'male' | 'female';
export type PhoneNumber = { countryCode: string, number: string };

export type Location = {
    longitude: String;
    latitude: String;
};

/**
 * Represents the input data required for registering a user.
 * ONLY USE FOR REGISTERING A USER.
 */
export type UserInput = {
    
    firstName: string;
    lastName: string;
    phoneNumber: PhoneNumber;
    email: string;
    password: string;
    gender: Gender;
};

/**
 * Represents the input data required for registering a post.
 * ONLY USE FOR CREATING A POST.
 */
export type PostInput = {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    time: string;
    location: Location;
    activity: Activity;
    creator?: User;
    peopleNeeded: number;
    preferredGender: Gender | 'any';
};


export type UserSummary = {
    firstName: string;
    lastName: string;
    email: string;
    interests: Interest[];
    gender: Gender;
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


export type PostPrevieuw = {
    id?: number,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    location: Location,
    activity: Activity,
    creator: UserSummary,
    peopleNeeded: number,
    peopleJoined : number,
    hasJoined : boolean,
    preferredGender: Gender | 'any';
}



