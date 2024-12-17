import { PhoneNumber } from "../types";

export type JWTTOKEN = string;

export type authResponse = {
    token: JWTTOKEN;
    refreshToken: JWTTOKEN;
};

export type JWTGivenToken = String | Array<String> | undefined ;

export type AccountLogin = {
    email: string;
    password: string;
};

export type AccountRegistraion = {
    type: "user" | "organization";
    username: string;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: PhoneNumber;
    email: string;
    password: string;
};

