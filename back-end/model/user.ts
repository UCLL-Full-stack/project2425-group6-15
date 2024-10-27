
import { Sex } from "../types";
import { Interest } from "./interest";
export class User {
    private id?: number;
    private firstName: string;
    private lastName: string;
    private phoneNumber: string;
    private email: string;
    private interests: Interest[];
    private sex: Sex;



    constructor(user: {
    id?: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    sex:Sex;
    interests: Interest[];
    })

     {
        this.validate(user);
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.phoneNumber = user.phoneNumber;
        this.email = user.email;
        this.sex = user.sex;
        this.interests = user.interests || [];
    }


    getId(): number | undefined {
        return this.id;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    getPhoneNumber(): string {
        return this.phoneNumber;
    }

    getEmail(): string {
        return this.email;
    }
    getSex(): Sex {
        return this.sex;
    }

    getInterests(): Interest[] {
        return this.interests;
    }


    validate(user: {
        id?: number;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        email: string;
        sex: Sex;
        interests: Interest[];
    }) {
        if (!user.firstName?.trim()) {
            throw new Error('First name is required');
        }
        if (!user.lastName?.trim()) {
            throw new Error('Last name is required');
        }
        if (!user.email?.trim()) {
            throw new Error('Email is required');
        }
        if (!user.phoneNumber?.trim()) {
            throw new Error('Phone number is required');
        }
        if (!user.sex) {
            throw new Error('Sex is required');
        }
    }




    addInterestToUser(interest: Interest) {
        if (!interest) throw new Error('Interest is required'); 
        if (this.interests.includes(interest))
            throw new Error('Interest already exists');
        this.interests.push(interest);
    }   
    
    equals(user: User): boolean {
        return (this.firstName === user.getFirstName() &&
                       this.lastName === user.getLastName() &&
                       this.phoneNumber === user.getPhoneNumber() &&
                       this.email === user.getEmail() &&
                       this.sex === user.getSex()
            )}
}