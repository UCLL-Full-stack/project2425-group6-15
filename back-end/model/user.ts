
import { Gender, PhoneNumber } from "../types";
import { Interest } from "./interest";

export class User {
    private id?: number;
    private firstName: string;
    private lastName: string;
    private phoneNumber: PhoneNumber;
    private email: string;
    private password: string;
    private interests: Interest[];
    private gender: Gender;



    constructor(user: {
    id?: number;
    firstName: string;
    lastName: string;
    phoneNumber: PhoneNumber;
    email: string;
    gender:Gender;
    password: string;
    interests: Interest[];
    })

     {
        this.validate(user);
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.phoneNumber = user.phoneNumber;
        this.email = user.email;
        this.password = user.password;
        this.gender = user.gender;
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

    getPhoneNumber(): PhoneNumber {
        return this.phoneNumber;
    }

    getEmail(): string {
        return this.email;
    }
    getPassword(): string {
        return this.password;
    }
    getGender(): Gender {
        return this.gender;
    }


    

    getInterests(): Interest[] {
        return this.interests;
    }


    validate(user: {
        id?: number;
        firstName: string;
        lastName: string;
        phoneNumber: PhoneNumber;
        email: string;
        gender: Gender;
        password: string;
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
        if (!user.phoneNumber.countryCode.trim()) {
            throw new Error('country code is required');
        }
        if (!user.phoneNumber.number.trim()) {
            throw new Error('phone number is required');
        }
        if (!user.password?.trim()) {
            throw new Error('Password is required');}

        if (!user.gender) {
            throw new Error('Gender is required');
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
                       this.gender === user.getGender()
            )}
}