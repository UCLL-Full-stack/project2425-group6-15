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

const create = async (userData: User): Promise<User> => {
    try {
        const existingUserByEmail = await database.user.findUnique({
            where: { email: userData.getEmail() },
        });
        if (existingUserByEmail) {
            throw new Error('User with this email already exists');
        }

        // const existingUserByPhoneNumber = await database.user.findUnique({
        //     where: { phoneNumber: userData.getPhoneNumber().countryCode + ' ' + userData.getPhoneNumber().number },
        // });
        // if (existingUserByPhoneNumber) {
        //     throw new Error('User with this phone number already exists');
        // }

        const createdUser = await database.user.create({
            data: {
                ...userData.toPrisma(),
                interests: {
                    create: userData.getInterests().map(interest => ({
                        name: interest.getName(),
                        description: interest.getDescription(),
                    })),
                },
                posts: {
                    create: [],
                },
                joinedPosts: {
                    create: [],
                },
            },
            include: {
                interests: true,
                posts: true,
                joinedPosts: true,
            },
        });
        return User.from(createdUser);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const getById = async (id: number): Promise<User | null> => {
    try {
        const user = await database.user.findUnique({
            where: { id },
            include: { interests: true, posts: true, joinedPosts: true },
        });
        return user ? User.from({
            ...user,
            interests: user.interests || [],
            posts: user.posts || [],
        }) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const getByEmail = async (email: string): Promise<User | null> => {
    try {
        const user = await database.user.findUnique({
            where: { email },
            include: { interests: true, posts: true, joinedPosts: true },
        });
        return user ? User.from(user) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const update = async (userData: User): Promise<User> => {
    try {
        const updatedUser = await database.user.update({
            where: { id: userData.getId() },
            data: {
                ...userData.toPrisma(),
                interests: {
                    upsert: userData.getInterests().map(interest => ({
                        where: { id: interest.getId() },
                        update: {
                            name: interest.getName(),
                            description: interest.getDescription(),
                        },
                        create: {
                            name: interest.getName(),
                            description: interest.getDescription(),
                        },
                    })),
                },
                posts: {
                    set: userData.getPosts().map(post => ({
                        id: post.getId(),
                    })),
                },
                joinedPosts: {
                    set: userData.getJoinedPosts().map(joinedPost => ({
                        id: joinedPost.getId(),
                    })),
                },
            },
            include: {
                interests: true,
                posts: true,
                joinedPosts: true,
            },
        });
        return User.from(updatedUser);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};
export default {
    getAll,
    create,
    getById,
    getByEmail,
    update
};