import { Post } from "./post";
import { User } from "./user";

import { Participant as ParticipantPrisma } from '@prisma/client';

export class Participant {
    private id?: number;
    private postId: number;
    private userId: number;
    private status: 'accepted' | 'pending' | 'rejected';
    public user?: User;
    public post?: Post;

    constructor(participant: {
        id?: number;
        postId: number;
        userId: number;
        status: 'accepted' | 'pending' | 'rejected';
        user?: User;
        post?: Post;
    }) {
        this.id = participant.id;
        this.postId = participant.postId;
        this.userId = participant.userId;
        this.status = participant.status;
        this.user = participant.user;
        this.post = participant.post;
    }

    getId(): number | undefined {
        return this.id;
    }

    getPostId(): number {
        return this.postId;
    }

    getUserId(): number {
        return this.userId;
    }
    
    toPrisma(): ParticipantPrisma  {
        return {
            id: this.id ?? 0,
            postId: this.postId,
            userId: this.userId,
            status: this.status,
        };
    }
    
    static from({
        id,
        postId,
        userId,
        status,
    }: ParticipantPrisma ): Participant {
        return new Participant({
            id,
            postId: postId,
            userId: userId,
            status: status as 'accepted' | 'pending' | 'rejected',
        });
    }
    
}