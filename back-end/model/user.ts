import { Gender, PhoneNumber } from "../types";
import { Interest } from "./interest";

import {
    User as UserPrisma,
    Interest as InterestPrisma,
} from '@prisma/client';

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
        gender: Gender;
        password: string;
        interests: Interest[];
    }) {
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

    setFirstName(firstName: string): void {
        if (!firstName.trim()) {
            throw new Error('First name is required');
        }
        this.firstName = firstName;
    }

    setLastName(lastName: string): void {
        if (!lastName.trim()) {
            throw new Error('Last name is required');
        }
        this.lastName = lastName;
    }

    setPhoneNumber(phoneNumber: PhoneNumber): void {
        if (!phoneNumber.countryCode.trim()) {
            throw new Error('Country code is required');
        }
        if (!phoneNumber.number.trim()) {
            throw new Error('Phone number is required');
        }
        this.phoneNumber = phoneNumber;
    }

    setEmail(email: string): void {
        if (!email.trim()) {
            throw new Error('Email is required');
        }
        this.email = email;
    }

    setPassword(password: string): void {
        if (!password.trim()) {
            throw new Error('Password is required');
        }
        this.password = password;
    }

    setGender(gender: Gender): void {
        if (!gender) {
            throw new Error('Gender is required');
        }
        this.gender = gender;
    }

    setInterests(interests: Interest[]): void {
        this.interests = interests;
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
            throw new Error('Password is required');
        }
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
        return (
            this.firstName === user.getFirstName() &&
            this.lastName === user.getLastName() &&
            this.phoneNumber === user.getPhoneNumber() &&
            this.email === user.getEmail() &&
            this.gender === user.getGender()
        );
    }

    toPrisma(): UserPrisma & { interests: InterestPrisma[] } {
        return {
            id: this.id ?? 0,
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: `${this.phoneNumber.countryCode} ${this.phoneNumber.number}`,
            email: this.email,
            gender: this.gender,
            password: this.password,
            interests: this.interests.map((interest) => interest.toPrisma()),
        };
    }

    static from({
        id,
        firstName,
        lastName,
        phoneNumber,
        email,
        gender,
        password,
        interests
    }: UserPrisma & { interests: InterestPrisma[] }) {
        return new User({
            id,
            firstName,
            lastName,
            phoneNumber: { countryCode: phoneNumber.split(' ')[0], number: phoneNumber.split(' ')[1] } as PhoneNumber,
            email,
            gender: gender as Gender,
            password,
            interests: interests.map(interest => Interest.from(interest)),
        });
    }
}