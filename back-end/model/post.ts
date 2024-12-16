import { Activity } from "./activity";
import { User } from "./user";
import { Gender, Location, PostInput, PostPrevieuw, PostSummary, UserSummary } from "../types";

import { Post as PostPrisma, Activity as ActivityPrisma, User as UserPrisma } from '@prisma/client';

export class Post {
    private id?: number;
    private title: string;
    private description: string;
    private startDate: Date;
    private endDate: Date;
    private time: string;
    private location: Location;
    private activity: Activity;
    private participants: User[];
    private peopleNeeded: number;
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
        participants: User[];
        peopleNeeded: number;
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
    }

    validate(post: {
        id?: number;
        title: string;
        description: string;
        startdate: string;
        enddate: string;
        time: String;
        location: Location;
        activity: Activity;
        creator: User;
        peopleNeeded: number;
    }) {
        if (!post.title.trim()) {
            throw new Error('Title is required');
        }
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

    getParticipants(): User[] {
        return this.participants;
    }

    getPeopleNeeded(): number {
        return this.peopleNeeded;
    }

    isFull(): boolean {
        return this.participants.length >= this.peopleNeeded;
    }

    addParticipant(user: User): void {
        if (this.participants.length >= this.peopleNeeded){
            throw new Error('max participants.')
        } 
        this.participants.push(user);
    }

    getPlacesLeft(): number{
        return (this.peopleNeeded - this.participants.length)
    }

    toPrevieuw( userid : number | undefined ): PostPrevieuw{
        return {
            id: this.getId(),
            title: this.getTitle(),
            description: this.getDescription(),
            startDate: this.getStartDate(),
            endDate: this.getEndDate(),
            location: this.getLocation(),
            activity: this.getActivity(),
            creator: this.getCreator().toSummary(),
            peopleNeeded: this.getPeopleNeeded(),
            peopleJoined : this.getParticipants().length,
            hasJoined : this.getParticipants().some(participant => participant.getId() === userid),
        }
    }

    toSummary(): PostSummary {
        const participants = this.getParticipants()
            .map(participant => participant ? participant.toSummary() : undefined)
            .filter((user): user is UserSummary => user !== undefined);

        return {
            id: this.getId(),
            title: this.getTitle(),
            description: this.getDescription(),
            startDate: this.getStartDate(),
            endDate: this.getEndDate(),
            time: this.getTime(),
            location: this.getLocation(),
            activity: this.getActivity(),
            creator: this.getCreator().toSummary(),
            participants: participants,
            peopleNeeded: this.getPeopleNeeded(),
        };
    }

    toPrisma(): PostPrisma & { activity: ActivityPrisma, creator: UserPrisma, participants: UserPrisma[] } {
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
        creator,
    }: PostPrisma & { activity: ActivityPrisma, creator: UserPrisma, participants: UserPrisma[] }): Post {
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
            }),
            participants: participants.map((participant: UserPrisma) => User.from({
                ...participant,
                interests: [],
                posts: [],
            })),
            peopleNeeded,
        });
    }

    static fromPostInput(post: PostInput): Post {
        if (post.creator === undefined) {
            throw new Error('Creator is required');
        }
        return new Post({
            id: undefined,
            title: post.title,
            description: post.description,
            startDate: post.startDate,
            endDate: post.endDate,
            time: post.time,
            location: post.location,
            activity: post.activity,
            creator: post.creator,
            participants: [],
            peopleNeeded: post.peopleNeeded,
        });
    }


}