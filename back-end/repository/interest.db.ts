import { Interest } from "../model/interest";
import database from "./database";

const getAll = async (): Promise<Interest[]> => {
    try {
        const interests = await database.interest.findMany();
        return interests.map((interest) => Interest.fromPrisma(interest));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

const getById = async (id: number): Promise<Interest | null> => {
    try {
        const interest = await database.interest.findUnique({
            where: { id },
        });
        return interest ? Interest.fromPrisma(interest) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const getByName = async (name: string): Promise<Interest | null> => {
    try {
        const interest = await database.interest.findUnique({
            where: { name },
        });
        return interest ? Interest.fromPrisma(interest) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const create = async (interest: Interest): Promise<void> => {
    try {
        await database.interest.create({
            data: {
                name: interest.getName(),
                description: interest.getDescription(),
            },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};
export default{
    getAll,
    getById,
    getByName,
    create,
};