import { Interest } from "../model/interest";
import database from "./database";

const getAll = async (): Promise<Interest[]> => {
    try {
        const interests = await database.interest.findMany();
        return interests.map((interest) => Interest.from(interest));
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
        return interest ? Interest.from(interest) : null;
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
        return interest ? Interest.from(interest) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

export default{
    getAll,
    getById,
    getByName,
};