import { ActivitySummary } from '../types';
import { Event } from './event';
import { Activity as ActivityPrisma, Event as EventPrisma} from '@prisma/client';

export class Activity {
    private id?: number;
    private name: string;
    private type: string;

    constructor(activity: { id?: number; name: string; type: string }) {
        if (!activity.name) {
            throw new Error('Name is required');
        }
        if (!activity.type) {
            throw new Error('Type is required');
        }
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

    toSummary(): ActivitySummary {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            events: 0, 
        };
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