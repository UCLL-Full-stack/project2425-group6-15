import { User } from "@prisma/client";
import { Participant } from "../model/participant";
import participantdb from "../repository/participant.db";
import { ServiceError } from "./service.error";
import userdb from "../repository/user.db";
import postdb from "../repository/post.db";
const getById = async (id: number|undefined): Promise<Participant> => {
    if (!id) {
        throw new ServiceError('Participant ID is required', 400);
    }
    let participant = await participantdb.getById(id);
    if (!participant) {
        throw new ServiceError('Participant not found', 404);
    }
    const user = await userdb.getById(participant.getUserId());
    if (!user) {
        throw new ServiceError('User not found', 404);
    }

    const post = await postdb.getById(participant.getPostId());
    if (!post) {
        throw new ServiceError('Post not found', 404);
    }

    participant.user = user;
    participant.post = post;
    return participant;
}

export default {
    getById,
};