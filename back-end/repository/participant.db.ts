import { Participant } from "../model/participant";
import database from "./database";


const getAll = async (): Promise<Participant[]> => {
    try {
        const PostPrisma = await database.participant.findMany({
            include:  { user: true, post: true },
        });
        let posts : Participant[] = PostPrisma.map((PostPrisma) => Participant.from(PostPrisma));
        return posts;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};
const getById = async (id: number): Promise<Participant | null> => {
    try {
        const participant = await database.participant.findUnique({
            where: { id },
            include: { user: true, post: true },
        });
        return participant ? Participant.from(participant) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}
export default{
    getAll,
    getById
};
