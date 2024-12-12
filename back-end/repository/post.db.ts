import { Post } from "../model/post";
import database from "./database";


const getAll = async (): Promise<Post[]> => {
    try {
        const PostPrisma = await database.post.findMany({
            include:  { activity: true, creator: true, participants: true },
        });
        let posts : Post[] = PostPrisma.map((PostPrisma) => Post.from(PostPrisma));
        return posts;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};
const getById = async (id: number): Promise<Post | null> => {
    try {
        const post = await database.post.findUnique({
            where: { id },
            include: { activity: true, creator: true, participants: true },
        });
        return post ? Post.from(post) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}
const getByJoinedUserId = async (userId: number): Promise<Post[]> => {
    try {
        const posts = await database.post.findMany({
            where: { participants: { some: { id: userId } } },
            include: { activity: true, creator: true, participants: true },
        });
        return posts.map((post) => Post.from(post));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const update = async (post: Post): Promise<Post> => {
    try {
        let prismapost = post.toPrisma();
        const { activity, creator, participants, ...prismapostWithoutActivity } = prismapost;
        const updatedPost = await database.post.update({
            where: { id: post.getId() },
            data: prismapostWithoutActivity,
            include: { activity: true, creator: true, participants: true },
        });
        return Post.from(updatedPost);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const create = async (post: Post): Promise<Post> => {
    try {
        let prismapost = post.toPrisma();
        const { activity, creator, participants, id, ...prismapostWithoutActivity } = prismapost;
        const createdPost = await database.post.create({
            data: prismapostWithoutActivity,
            include: { activity: true, creator: true, participants: true },
        });
        return Post.from(createdPost);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}


export default{
    getAll,
    getById,
    create,
    getByJoinedUserId,
    update,
};
