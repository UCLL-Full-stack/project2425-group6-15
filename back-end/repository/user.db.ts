import { User } from "../model/user";
import database from "./database";
import postdb from "./post.db";
const getAll = async (): Promise<User[]> => {
    try {
        const UserPrisma = await database.user.findMany({
            include:  { interests: true, posts: true},
        });
        const users = await Promise.all(UserPrisma.map(async (userPrisma) => {
            const user = User.from(userPrisma);
            const joinedPosts = await postdb.getByJoinedUserId(userPrisma.id);
            user.setJoinedPosts(joinedPosts);
            return user;
        }));
        return users;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

const getById = async (id: number): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { id },
            include: { interests: true, posts: true },
        });
        if (userPrisma) {
            const user = User.from(userPrisma);
            const joinedPosts = await postdb.getByJoinedUserId(userPrisma.id);
            user.setJoinedPosts(joinedPosts);
            return user;
        }else{
            return null;
        }

    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const getByEmail = async (email: string): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { email },
            include: { interests: true, posts: true,},
        });
        if (userPrisma) {
            const user = User.from(userPrisma);
            const joinedPosts = await postdb.getByJoinedUserId(userPrisma.id);
            user.setJoinedPosts(joinedPosts);
            return user;
        }else{
            return null;
        }
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const create = async (user: User): Promise<User> => {
    try {
        const prismauser = user.toPrisma();
        const { id, ...prismauserWithoutId } = prismauser; 
        const userPrisma = await database.user.create({
            data: {
                ...prismauserWithoutId,
                interests: {
                    connect: prismauser.interests.map((interest) => ({ id: interest.id })),
                },
                posts: {
                    connect: prismauser.posts.map((post) => ({ id: post.id })),
                },
            },
            include: { interests: true, posts: true },
        });
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

const update = async (user: User): Promise<User> => {
    try {
        const prismauser = user.toPrisma();
        const userPrisma = await database.user.update({
            where: { id: user.getId() },
            include: { interests: true, posts: true },
            data: {
                ...prismauser,
                interests: {
                    set: prismauser.interests.map((interest) => ({ id: interest.id })),
                },
                posts: {
                    set: prismauser.posts.map((post) => ({ id: post.id })),
                },
            },
        });
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

const remove = async (id: number): Promise<void> => {
    try {
        await database.user.delete({
            where: { id },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

export default {
    getAll,
    getById,
    getByEmail,
    create,
    update,
    remove,
};