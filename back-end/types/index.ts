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


export { UserInput, Gender , PhoneNumber};