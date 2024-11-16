import { User } from "../model/user";
import database from "./database";

const users: User[] = [];

const getAllUsers = async (): Promise<User[]> => {
    try {
        const UserPrisma = await database.user.findMany({
            include:  { interests: true},
        });
        return UserPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

const createUser = async (userData: User): Promise<User> => {
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
            },
            include: {
                interests: true,
            },
        });
        return User.from(createdUser);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const getUserById = async (id: number): Promise<User | null> => {
    try {
        const user = await database.user.findUnique({
            where: { id },
            include: { interests: true },
        });
        return user ? User.from(user) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const user = await database.user.findUnique({
            where: { email },
            include: { interests: true },
        });
        return user ? User.from(user) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const updatedUser = async (userdata: User): Promise<User | null> => {
    try {
        const existingUser = await database.user.findUnique({
            where: { id: userdata.getId() },
        });
        if (!existingUser) {
            throw new Error('User not found');
        }

        const existingUserByPhoneNumber = await database.user.findFirst({
            where: { phoneNumber: userdata.getPhoneNumber().countryCode + ' ' + userdata.getPhoneNumber().number },
        });
        if (existingUserByPhoneNumber && existingUserByPhoneNumber.id !== userdata.getId()) {
            throw new Error('User with this phone number already exists');
        }

        const user = await database.user.update({
            where: { id: userdata.getId() },
            data: {
                ...userdata.toPrisma(),
                interests: {
                    set: userdata.getInterests().map(interest => ({
                        id: interest.getId(),
                        name: interest.getName(),
                        description: interest.getDescription(),
                    })),
                },
            },
            include: { interests: true },
        });
        return user ? User.from(user) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }

}

export default {
    getAllUsers,
    createUser,
    getUserById,
    getUserByEmail,
    updatedUser
};