import { Activity } from "../model/activity";
import database from "./database";

const getAll = async (): Promise<Activity[]> => {
    try {
        const ActivityPrisma = await database.activity.findMany({
            include:  { posts: true},
        });
        return ActivityPrisma.map((ActivityPrisma) => Activity.from(ActivityPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

const getById = async (id: number): Promise<Activity | null> => {
    try {
        const activity = await database.activity.findUnique({
            where: { id },
            include: { posts: true },
        });
        return activity ? Activity.from(activity) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

export default { getAll, getById };