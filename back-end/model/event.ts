import { Activity } from "./activity";
import { Account } from "./account";
import { Location, EventInput, EventSummary, AccountSummary, EventPreview, PublicEvent } from "../types";

import { Event as EventPrisma, Activity as ActivityPrisma, Account as AccountPrisma } from '@prisma/client';

export class Event {
    private id?: number;
    private title: string;
    private description: string;
    private startDate: Date;
    private endDate: Date;
    private location: Location;
    private activity: Activity;
    private participants: Account[];
    private peopleNeeded: number;
    private creator: Account;

    constructor(event: {
        id?: number;
        title: string;
        description: string;
        startDate: Date;
        endDate: Date;
        location: Location;
        activity: Activity;
        creator: Account;
        participants: Account[];
        peopleNeeded: number;
    }) {
        this.id = event.id;
        this.title = event.title;
        this.description = event.description;
        this.startDate = event.startDate;
        this.endDate = event.endDate;
        this.location = event.location;
        this.activity = event.activity;
        this.creator = event.creator;
        this.participants = event.participants || [];
        this.peopleNeeded = event.peopleNeeded;
        this.validate();
    }

    validate() {
        if (!this.title.trim()) {
            throw new Error('Title is required');
        }
        if (!this.description.trim()) {
            throw new Error('Description is required');
        }
        if (this.getPeopleNeeded() <= 0) {
            throw new Error('People needed must be greater than 0');
        }
        if (this.getStartDate() >= this.getEndDate()) {
            throw new Error('End date must be after start date');
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



    getLocation(): Location {
        return this.location;
    }

    getActivity(): Activity {
        return this.activity;
    }

    getCreator(): Account {
        return this.creator;
    }

    getParticipants(): Account[] {
        return this.participants;
    }

    getPeopleNeeded(): number {
        return this.peopleNeeded;
    }

    isFull(): boolean {
        return this.participants.length >= this.peopleNeeded;
    }

    addParticipant(account: Account): void {
        if (this.participants.length >= this.peopleNeeded){
            throw new Error('max participants.')
        } 
        this.participants.push(account);
    }

    removeParticipant(account: Account): void {
        this.participants = this.participants.filter((participant) => participant.getId() !== account.getId());
    }

    getPlacesLeft(): number{
        return (this.peopleNeeded - this.participants.length)
    }

    toPrevieuw( accountid : number ): EventPreview{
        return {
            id: this.getId(),
            title: this.getTitle(),
            description: this.getDescription(),
            startDate: this.getStartDate(),
            endDate: this.getEndDate(),
            location: this.getLocation(),
            activity: this.getActivity(),
            creator: this.getCreator().toPrevieuw(),
            peopleNeeded: this.getPeopleNeeded(),
            peopleJoined : this.getParticipants().length,
            hasJoined : this.getParticipants().some(participant => participant.getId() === accountid),
        }
    }

    toSummary(accountid : number): EventSummary {
        return {
            id: this.getId(),
            title: this.getTitle(),
            description: this.getDescription(),
            startDate: this.getStartDate(),
            endDate: this.getEndDate(),
            location: this.getLocation(),
            activity: this.getActivity(),
            creator: this.getCreator().toSummary(),
            participants: this.participants.map((account) => account.toSummary()),
            peopleNeeded: this.getPeopleNeeded(),
            hasJoined : this.getParticipants().some(participant => participant.getId() === accountid),
        };
    }

    toPublic(accountid : number): PublicEvent {
        return {
            id: this.getId() ?? 0,
            title: this.getTitle(),
            description: this.getDescription(),
            startDate: this.getStartDate(),
            endDate: this.getEndDate(),
            location: this.getLocation(),
            activity: this.getActivity(),
            creator: this.getCreator().toSummary(),
            participants: this.getParticipants().map((account) => account.toPrevieuw()),
            peopleNeeded: this.getPeopleNeeded(),
        
            hasJoined : this.getParticipants().some(participant => participant.getId() === accountid),
        }
    }

    static fromEventInput(event: EventInput, eventActivity: Activity): Event {
        if (event.creator === undefined) {
            throw new Error('Creator is required');
        }
        return new Event({
            id: undefined,
            title: event.title,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate,
            location: event.location,
            activity: eventActivity,
            creator: event.creator,
            participants: [],
            peopleNeeded: event.peopleNeeded,
        });
    }

    // event to prisma
    toPrisma(): EventPrisma & { activity: ActivityPrisma, creator: AccountPrisma, participants: AccountPrisma[] } {
        return {
            id: this.id ?? 0,
            title: this.title,
            description: this.description,
            startDate: this.startDate,
            endDate: this.endDate,
            location: `${this.location.longitude}|&|${this.location.latitude}`,
            activityId: this.activity.getId() ?? 0,
            creatorId: this.creator.getId() ?? 0,
            activity: this.activity.toPrisma(),
            creator: this.creator.toPrisma(),
            participants: this.participants.map(participant => participant.toPrisma()),
            peopleNeeded: this.peopleNeeded,
        };
    }

    // prisma to event
    static fromPrisma({
        id,
        title,
        description,
        startDate,
        endDate,
        location,
        activity,
        participants,
        peopleNeeded,
        creator,
    }: EventPrisma & { activity: ActivityPrisma, creator: AccountPrisma, participants: AccountPrisma[]}): Event {
        return new Event({
            id,
            title,
            description,
            startDate,
            endDate,
            location: { longitude: location.split('|&|')[0], latitude: location.split('|&|')[1] } as Location,
            activity: Activity.fromPrisma(activity),
            creator: Account.fromPrisma({ ...creator, interests: [] }),
            participants: participants.map((participant: AccountPrisma) => Account.fromPrisma({ ...participant, interests: [] })),
            peopleNeeded,
        });
    }


}