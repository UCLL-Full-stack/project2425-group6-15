import { PhoneNumber } from "../types";

type JWTTOKEN = string;

type authResponse = {
    token: JWTTOKEN;
    refreshToken: JWTTOKEN;
};

type JWTGivenToken = String | Array<String> | undefined ;

type AccountLogin = {
    email: string;
    password: string;
};

type AccountRegistraion = {
    type: "user" | "organization";
    username: string;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: PhoneNumber;
    email: string;
    password: string;
};

export { JWTTOKEN,JWTGivenToken, AccountLogin, AccountRegistraion, authResponse};