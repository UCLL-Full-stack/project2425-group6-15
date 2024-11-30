import { User } from "../model/user";
import database from "./database";

const getAll = async (): Promise<User[]> => {
    try {
        const UserPrisma = await database.user.findMany({
            include:  { interests: true, posts: true, joinedPosts: true },
        });
        return UserPrisma.map((userPrisma) => User.from(userPrisma));
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
            joinedPosts: user.joinedPosts || []
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


export default {
    getAll,
    create,
    getById,
    getByEmail,
};