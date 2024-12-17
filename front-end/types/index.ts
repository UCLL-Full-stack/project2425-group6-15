export type PhoneNumber = { countryCode: string, number: string };
export type JWTTOKEN = string;
export type JWTGivenToken = String | Array<String> | undefined ;
export type Role = 'admin' | 'user' | 'organization';
export type Location = {
    longitude: String;
    latitude: String;
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

export type AccountLogin = {
    email: string;
    password: string;
};

export type AccountRegistraion = {
    type: "user" | "organization";
    username: string;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: PhoneNumber;
    email: string;
    password: string;
};

/**
 * Represents the input data required for editing a account.
 * ONLY USE FOR REGISTERING A Account.
 */
export type AccountInput = {
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: PhoneNumber;
    email: string;
};

/**
 * Represents the input data required for registering/editing a event.
 * ONLY USE FOR CREATING A POST.
 */
export type EventInput = {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    time: string;
    location: Location;
    activityName: string;
    peopleNeeded: number;
};


export type EventPreview = {
    id?: number,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    location: Location,
    activity: Activity,
    creator: AccountPreview,
    peopleNeeded: number,
    peopleJoined : number,
    hasJoined : boolean,
};

export type AccountPreview = {
    username : string,
    email : string,
    fullname: string,
    type: Role
}


export type AccountSummary = {
    type: Role;
    firstName: string;
    lastName: string;
    email: string;
    interests: Interest[];
};

export type EventSummary = {
    id?: number,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    time: string,
    location: Location,
    activity: Activity,
    creator: AccountSummary,
    participants: AccountSummary[],
    peopleNeeded: number,
    hasJoined : boolean,
};


export type PublicAccount = {
    type: Role;
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: PhoneNumber;
    email: string;
    interests: Interest[];
    events: PublicEvent[];
    joinedEvents: PublicEvent[];
}

export type PublicEvent = {
    id: number,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    location: Location,
    activity: Activity,
    creator: AccountSummary,
    participants: AccountPreview[],
    peopleNeeded: number,

    hasJoined : boolean,
}


