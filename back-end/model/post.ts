import { Activity } from "./activity";
import { User } from "./user";
import { Gender, Location, PostSummary, UserSummary } from "../types";

import { Post as PostPrisma, Activity as ActivityPrisma, User as UserPrisma, Participant as ParticipantPrisma } from '@prisma/client';
import { Participant } from "./participant";

export class Post {
    private id?: number;
    private title: string;
    private description: string;
    private startDate: Date;
    private endDate: Date;
    private time: string;
    private location: Location;
    private activity: Activity;
    private participants: Participant[];
    private peopleNeeded: number;
    private preferredGender: Gender | 'both';
    private creator: User;

    constructor(post: {
        id?: number;
        title: string;
        description: string;
        startDate: Date;
        endDate: Date;
        time: string;
        location: Location;
        activity: Activity;
        creator: User;
        participants: Participant[];
        peopleNeeded: number;
        preferredGender: Gender | 'both';
    }) {
        this.id = post.id;
        this.title = post.title;
        this.description = post.description;
        this.startDate = post.startDate;
        this.endDate = post.endDate;
        this.time = post.time;
        this.location = post.location;
        this.activity = post.activity;
        this.creator = post.creator;
        this.participants = post.participants || [];
        this.peopleNeeded = post.peopleNeeded;
        this.preferredGender = post.preferredGender;
    }

    getId(): number | undefined {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getDescription(): string {
        return this.description;
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    getTime(): string {
        return this.time;
    }

    getLocation(): Location {
        return this.location;
    }

    getActivity(): Activity {
        return this.activity;
    }

    getCreator(): User {
        return this.creator;
    }

    getparticipants(): Participant[] {
        return this.participants;
    }

    getPeopleNeeded(): number {
        return this.peopleNeeded;
    }

    getPreferredGender(): Gender | 'both' {
        return this.preferredGender;
    }

    toPrisma(): PostPrisma & { activity: ActivityPrisma, creator: UserPrisma, participants: ParticipantPrisma[] } {
        return {
            id: this.id ?? 0,
            title: this.title,
            description: this.description,
            startDate: this.startDate,
            endDate: this.endDate,
            time: this.time,
            location: `${this.location.longitude}|&|${this.location.latitude}`,
            activityId: this.activity.getId() ?? 0,
            creatorId: this.creator.getId() ?? 0,
            activity: this.activity.toPrisma(),
            creator: this.creator.toPrisma(),
            participants: this.participants.map(participant => participant.toPrisma()),
            peopleNeeded: this.peopleNeeded,
            preferredGender: this.preferredGender,
        };
    }

    static from({
        id,
        title,
        description,
        startDate,
        endDate,
        time,
        location,
        activity,
        participants,
        peopleNeeded,
        preferredGender,
        creator,
    }: PostPrisma & { activity: ActivityPrisma, creator: UserPrisma, participants: ParticipantPrisma[] }): Post {
        return new Post({
            id,
            title,
            description,
            startDate,
            endDate,
            time,
            location: { longitude: location.split('|&|')[0], latitude: location.split('|&|')[1] } as Location,
            activity: Activity.from(activity),
            creator: User.from({
                ...creator,
                interests: [],
                posts: [],
                joinedPosts: []
            }),
            participants: participants.map(participant => Participant.from(participant)),
            peopleNeeded,
            preferredGender: preferredGender as Gender | 'both',
        });
    }

    static toSummary(post: Post): PostSummary {
        const participants = post.getparticipants()
            .map(participant => participant.user ? User.toSummary(participant.user) : undefined)
            .filter((user): user is UserSummary => user !== undefined);

        return {
            id: post.getId(),
            title: post.getTitle(),
            description: post.getDescription(),
            startDate: post.getStartDate(),
            endDate: post.getEndDate(),
            time: post.getTime(),
            location: post.getLocation(),
            activity: post.getActivity(),
            creator: User.toSummary(post.getCreator()),
            participants: participants,
            peopleNeeded: post.getPeopleNeeded(),
            preferredGender: post.getPreferredGender(),
        };
    }
}