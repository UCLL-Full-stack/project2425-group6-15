import { Gender, PhoneNumber } from "../types";

type JWTTOKEN = string;

type authResponse = {
    token: JWTTOKEN;
    refreshToken: JWTTOKEN;
};

type JWTGivenToken = String | Array<String> | undefined ;

type UserLogin = {
    email: string;
    password: string;
};

type UserRegistraion = {
    id?: number;
    firstName: string;
    lastName: string;
    phoneNumber: PhoneNumber;
    email: string;
    password: string;
    gender: Gender;
};

export { JWTTOKEN,JWTGivenToken, UserLogin, UserRegistraion, authResponse};