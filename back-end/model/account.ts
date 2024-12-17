import { PhoneNumber, AccountInput, AccountSummary, AccountPreview, PublicAccount } from "../types";
import { Activity } from "./activity";
import { Interest } from "./interest";
import { Event } from "./event";
import { Role } from "../types";
import {
    Account as AccountPrisma,
    Interest as InterestPrisma,
} from '@prisma/client';
import { AccountRegistraion } from "../authentication/auth.model";
import { log } from "console";

export class Account {
    private id?: number;
    public type: Role;
    private username : string;
    private firstName: string;
    private lastName: string;
    private phoneNumber: PhoneNumber;
    private email: string;
    private password: string;
    private interests: Interest[];
    private events: Event[];
    private joinedEvents: Event[];

    constructor(account: {
        id?: number;
        type : Role;
        username : string;
        firstName: string;
        lastName: string;
        phoneNumber: PhoneNumber;
        email: string;
        password: string;
        interests: Interest[];
        events: Event[];
        joinedEvents: Event[];
    }) {
        this.id = account.id;
        this.type = account.type;
        this.username = account.username;
        this.firstName = account.firstName;
        this.lastName = account.lastName;
        this.phoneNumber = account.phoneNumber;
        this.email = account.email;
        this.password = account.password;
        this.interests = account.type === 'user' ? account.interests || [] : [];
        this.events = account.type === 'admin' ? [] : account.events || [];
        this.joinedEvents = account.type === 'user' ? account.joinedEvents || [] : [];
        this.validate()
    }

    private validate() {
    if (!this.firstName?.trim() && this.type !== "organization") {
        throw new Error('First name is required');
    }
    if (!this.lastName?.trim() && this.type !== "organization") {
        throw new Error('Last name is required');
    }
    if (!this.email?.trim()) {
        throw new Error('Email is required');
    }
    if (!this.phoneNumber.countryCode.trim()) {
        throw new Error('country code is required');
    }
    if (!this.phoneNumber.number.trim()) {
        throw new Error('phone number is required');
    }
    if (!this.password?.trim()) {
        throw new Error('Password is required');
    }
    if (this.type !== 'user' && this.interests.length > 0) {
        throw new Error('Only accounts can have interests');
    }
}


    getId(): number | undefined {
        return this.id;
    }
    getUsername(): string {
        return this.username;
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

    getInterests(): Interest[] {
        return this.interests;
    }

    getEvents(): Event[] {
        return this.events;
    }

    getJoinedEvents(): Event[] {
        return this.joinedEvents;
    }

    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    getType(): Role {
        return this.type;
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

    setUsername(username: string) : void {
        this.username = username;
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


    setInterests(interests: Interest[]): void {
        if (this.type !== "user") {
            throw new Error('Only accounts can have interests');
        }
        this.interests = interests;
    }

    setEvents(events: Event[]): void {
        if (this.type === 'admin') {
            throw new Error('Admins cannot create events');
        }
        this.events = events;
    }

    setJoinedEvents(joinedEvents: Event[]): void {
        if (this.type !== 'user' && joinedEvents.length > 0) {
            throw new Error('Only users can join events');
        }
        this.joinedEvents = joinedEvents;
    }



    addInterestToAccount(interest: Interest) {
        if (this.type !== 'user') {
            throw new Error('Only accounts can have interests');
        }
        if (!interest) throw new Error('Interest is required');
        if (this.interests.some(existingInterest => existingInterest.getId() === interest.getId())) {
            throw new Error('Dublication of interest is not allowed');
        }
        this.interests.push(interest);
    }

    equals(account: Account): boolean {
        return (
            this.username === account.username &&
            this.firstName === account.getFirstName() &&
            this.lastName === account.getLastName() &&
            this.phoneNumber === account.getPhoneNumber() &&
            this.email === account.getEmail()
        );
    }

    toPrevieuw() : AccountPreview{
        return {
            type : this.getType(),
            username: this.getUsername(),
            email : this.getEmail(),
            fullname : this.getFullName(),
        }
    }

    toSummary(): AccountSummary {
        return {
            type: this.getType(),
            firstName: this.getFirstName(),
            lastName: this.getLastName(),
            email: this.getEmail(),
            interests: this.getInterests(),
        };
    }

    toPublic(): PublicAccount {
        return {
            type: this.getType(),
            id: this.getId() ?? 0,
            firstName: this.getFirstName(),
            lastName: this.getLastName(),
            phoneNumber: this.getPhoneNumber(),
            email: this.getEmail(),
            interests: this.getInterests(),
            events: this.getEvents().map(event => event.toPublic(this.getId() ?? 0)),
            joinedEvents: this.getJoinedEvents().map(event => event.toPublic(this.getId() ?? 0)),
        }
    }

    static fromAccountRegistraion(account: AccountRegistraion): Account {
        return new Account({
            id: undefined,
            type: account.type,
            username: account.username,
            firstName: account.firstName ?? '',
            lastName: account.lastName ?? '',
            phoneNumber: account.phoneNumber,
            email: account.email,
            password: account.password,
            interests:  [],
            events: [],
            joinedEvents: [],
        });
    }


    // account to prisma
    toPrisma(): AccountPrisma & { interests: InterestPrisma[]} {
        return {
            id: this.id ?? 0,
            type: this.type,
            username: this.username,
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: `${this.phoneNumber.countryCode} ${this.phoneNumber.number}`,
            email: this.email,
            password: this.password,
            interests: this.interests.map((interest) => interest.toPrisma()),
        };
    }

    // prisma to account
    static fromPrisma({
        id,
        type,
        username,
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        interests,
    }: AccountPrisma & { interests: InterestPrisma[] }) {
        return new Account({
            id,
            type: type as Role,
            username: username,
            firstName,
            lastName,
            phoneNumber: { countryCode: phoneNumber.split(' ')[0], number: phoneNumber.split(' ')[1] } as PhoneNumber,
            email,
            password,
            interests: interests.map((interest: InterestPrisma) => Interest.fromPrisma(interest)),
            events:[],
            joinedEvents: [],
        });
    }
}