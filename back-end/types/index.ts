import { Interest } from "../model/interest";

type UserInput = {
    id?: number;
    firstName: string;
    lastName: string;
    phoneNumber: PhoneNumber;
    email: string;
    password: string;
    gender: Gender;
};

type Gender = 'male' | 'female';
type PhoneNumber = { countryCode: string, number: string };

export type UserSummary = {
    firstName: string;
    lastName: string;
    email: string;
    interests: Interest[];
    gender: Gender;
  };



export { UserInput, Gender , PhoneNumber};