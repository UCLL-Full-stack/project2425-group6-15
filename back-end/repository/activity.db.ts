import { Activity } from "../model/activity";
import database from "./database";

const getAll = async (): Promise<Activity[]> => {
    try {
        const ActivityPrisma = await database.activity.findMany({
            include:  { events: true},
        });
        return ActivityPrisma.map((ActivityPrisma) => Activity.fromPrisma(ActivityPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

const getById = async (id: number): Promise<Activity | null> => {
    try {
        const activity = await database.activity.findUnique({
            where: { id },
            include: { events: true },
        });
        return activity ? Activity.fromPrisma(activity) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const getByName = async (name: string): Promise<Activity | null> => {
    try {
        const activity = await database.activity.findUnique({
            where: { name },
            include: { events: true },
        });
        return activity ? Activity.fromPrisma(activity) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}
export default { getAll, getById, getByName };