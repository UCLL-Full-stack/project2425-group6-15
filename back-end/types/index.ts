type UserInput = {
    id?: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    sex: Sex;
};
type Sex = 'male' | 'female';


export { UserInput,Sex };