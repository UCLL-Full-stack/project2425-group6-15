export type Gender = 'male' | 'female';
export type PhoneNumber = { countryCode: string, number: string };
export type JWTTOKEN = string;
export type JWTGivenToken = String | Array<String> | undefined ;

export type UserLogin = {
    email: string;
    password: string;
};

export type UserRegistration = {
    id?: number;
    firstName: string;
    lastName: string;
    phoneNumber: PhoneNumber;
    email: string;
    password: string;
    gender: Gender;
};

export type UserSummary = {
    firstName: string;
    lastName: string;
    email: string;
    interests: Interest[];
    gender: Gender;
};

export type Location = {
    longitude: String;
    latitude: String;
};
export type User = {
    id?: number,
    firstName: string,
    lastName: string,
    phoneNumber: PhoneNumber,
    email: string,
    password: string,
    interests: Interest[],
    gender: Gender,
    posts: Post[],
    joinedPosts: Post[],
}
export type PostSummary = {
    id?: number,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    time: string,
    location: Location,
    activity: Activity,
    creator: UserSummary,
    participants: UserSummary[],
    peopleNeeded: number,
    preferredGender: Gender | 'both';
};
export type Post = {
    id?: number,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    time: string,
    location: Location,
    activity: Activity,
    creator: User,
    participants: User[],
    peopleNeeded: number,
    preferredGender: Gender | 'both',
};


export type Activity = {
    id?: number;
    name: string;
    type: string;
};

export type Interest = {
    id?: number;
    name: string;
    description: string;
};


