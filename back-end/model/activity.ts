import { Post } from './post';
import { Activity as ActivityPrisma, Post as PostPrisma} from '@prisma/client';


export class Activity {
    private id?: number;
    private name: string;
    private type: string;
    private posts: Post[];

    constructor(activity: {
        id?: number;
        name: string;
        type: string;
        posts: Post[];
    }) {
        this.id = activity.id;
        this.name = activity.name;
        this.type = activity.type;
        this.posts = activity.posts || [];
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

    getPosts(): Post[] {
        return this.posts;
    }

    toPrisma(): ActivityPrisma {
        return {
            id: this.id ?? 0,
            name: this.name,
            type: this.type,
        };
    }

    static from(activity: ActivityPrisma): Activity {
        return new Activity({
            id: activity.id,
            name: activity.name,
            type: activity.type,
            posts: [], // Posts should be populated separately if needed
        });
    }
}