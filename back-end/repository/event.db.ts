import { Event } from "../model/event";
import database from "./database";


const getAll = async (): Promise<Event[]> => {
    try {
        const EventPrisma = await database.event.findMany({
            include:  { activity: true, creator: true, participants: true },
        });
        let events : Event[] = EventPrisma.map((EventPrisma) => Event.fromPrisma(EventPrisma));
        return events;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};
const getById = async (id: number): Promise<Event | null> => {
    try {
        const event = await database.event.findUnique({
            where: { id },
            include: { activity: true, creator: true, participants: true },
        });
        return event ? Event.fromPrisma(event) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}
const getByJoinedAccountId = async (accountId: number): Promise<Event[]> => {
    try {
        const events = await database.event.findMany({
            where: { participants: { some: { id: accountId } } },
            include: { activity: true, creator: true, participants: true },
        });
        return events.map((event) => Event.fromPrisma(event));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}
const getByCreatorId = async (accountId: number): Promise<Event[]> => {
    try {
        const events = await database.event.findMany({
            where: { creatorId: accountId },
            include: { activity: true, creator: true, participants: true },
        });
        return events.map((event) => Event.fromPrisma(event));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}
const update = async (event: Event): Promise<Event> => {
    try {
        let prismaevent = event.toPrisma();
        const { activity, creator, participants, id, ...prismaeventWithoutActivity } = prismaevent;

        const updatedEvent = await database.event.update({
            where: { id: event.getId() },
            data: {
                ...prismaeventWithoutActivity,
                participants: {
                    set: participants.map((participant: any) => ({ id: participant.id })),
                },
            },
            include: { activity: true, creator: true, participants: true },
        });
        return Event.fromPrisma(updatedEvent);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const create = async (event: Event): Promise<Event> => {
    try {
        let prismaevent = event.toPrisma();
        const { activity, creator, participants, id, ...prismaeventWithoutActivity } = prismaevent;
        const createdEvent = await database.event.create({
            data: prismaeventWithoutActivity,
            include: { activity: true, creator: true, participants: true },
        });
        return Event.fromPrisma(createdEvent);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const deleteEvent = async (id: number): Promise<void> => {
    try {
        await database.event.delete({
            where: { id },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}
const getBySelectedActivity = async (activityId: number): Promise<Event[]> => {
    try {
        const events = await database.event.findMany({
            where: { activityId },
            include: { activity: true, creator: true, participants: true },
        });
        return events.map((event) => Event.fromPrisma(event));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

export default{
    getAll,
    getById,
    create,
    getByJoinedAccountId,
    update,
    getByCreatorId,
    deleteEvent,
    getBySelectedActivity
};
