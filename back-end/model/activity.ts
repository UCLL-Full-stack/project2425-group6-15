import { Event } from './event';
import { Activity as ActivityPrisma, Event as EventPrisma} from '@prisma/client';


export class Activity {
    private id?: number;
    private name: string;
    private type: string;

    constructor(activity: {
        id?: number;
        name: string;
        type: string;
    }) {
        this.id = activity.id;
        this.name = activity.name;
        this.type = activity.type;
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getType(): string {
        return this.type;
    }



    toPrisma(): ActivityPrisma {
        return {
            id: this.id ?? 0,
            name: this.name,
            type: this.type,
        };
    }

    static fromPrisma(activity: ActivityPrisma): Activity {
        return new Activity({
            id: activity.id,
            name: activity.name,
            type: activity.type,
        });
    }
}