import { Gender, PhoneNumber, UserInput, UserSummary } from "../types";
import { Activity } from "./activity";
import { Interest } from "./interest";
import { Post } from "./post";
import { Role } from "../types";
import {
    User as UserPrisma,
    Interest as InterestPrisma,
    Post as PostPrisma,
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
    private posts: Post[];
    private joinedPosts: Post[];
    private role: Role;

    constructor(user: {
        id?: number;
        firstName: string;
        lastName: string;
        phoneNumber: PhoneNumber;
        email: string;
        gender: Gender;
        role: Role;
        password: string;
        interests: Interest[];
        posts: Post[];
        joinedPosts: Post[];
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
        this.posts = user.posts || [];
        this.joinedPosts = user.joinedPosts || [];
        this.role = user.role;
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

    getPosts(): Post[] {
        return this.posts;
    }

    getJoinedPosts(): Post[] {
        return this.joinedPosts;
    }

    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    getRole(): Role {
        return this.role;
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

    setPosts(posts: Post[]): void {
        this.posts = posts;
    }

    setJoinedPosts(joinedPosts: Post[]): void {
        this.joinedPosts = joinedPosts;
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
        role: Role;
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
        if (this.interests.some(existingInterest => existingInterest.getId() === interest.getId())) {
            throw new Error('Dublication of interest is not allowed');
        }
        this.interests.push(interest);
    }

    equals(user: User): boolean {
        return (
            this.firstName === user.getFirstName() &&
            this.lastName === user.getLastName() &&
            this.phoneNumber === user.getPhoneNumber() &&
            this.email === user.getEmail() &&
            this.gender === user.getGender() &&
            this.role === user.getRole()
        );
    }

    toSummary(): UserSummary {
        return {
            firstName: this.getFirstName(),
            lastName: this.getLastName(),
            email: this.getEmail(),
            gender: this.getGender(),
            interests: this.getInterests(),
            
        };
    }


    toPrisma(): UserPrisma & { interests: InterestPrisma[], posts: PostPrisma[] } {
        return {
            id: this.id ?? 0,
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: `${this.phoneNumber.countryCode} ${this.phoneNumber.number}`,
            email: this.email,
            gender: this.gender,
            role: this.role,
            password: this.password,
            interests: this.interests.map((interest) => interest.toPrisma()),
            posts: this.posts.map((post) => post.toPrisma()),
        };
    }

    static from({
        id,
        firstName,
        lastName,
        phoneNumber,
        email,
        gender,
        role,
        password,
        interests,
        posts,
    }: UserPrisma & { interests: InterestPrisma[], posts: PostPrisma[] }) {
        return new User({
            id,
            firstName,
            lastName,
            phoneNumber: { countryCode: phoneNumber.split(' ')[0], number: phoneNumber.split(' ')[1] } as PhoneNumber,
            email,
            gender: gender as Gender,
            role: role as Role,
            password,
            interests: interests.map(interest => Interest.from(interest)),
            posts: posts.map(post => Post.from({
                ...post,
                activity: { id: 0, name: '', type: '' },
                creator: { id, firstName, lastName, phoneNumber, email, password, gender, role  },
                participants: [],
            })),
            joinedPosts: [],
        });
    }


    static fromUserinput(user: UserInput): User {
        return new User({
            id: 0,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            gender: user.gender,
            role: 'user',
            password: user.password,
            interests:  [],
            posts: [],
            joinedPosts: [],
        });
    }
}