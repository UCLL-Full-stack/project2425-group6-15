import { Account} from '../model/account'; 
import { EventInput, EventPreview, EventSummary, AccountInput, AccountSummary } from '../types';
import { ServiceError } from './service.error';
import eventdb from '../repository/event.db';
import { Event } from '../model/event';
import activityDb from '../repository/activity.db';
import { log } from 'console';

const getAllEvents = async (currentAccount : Account): Promise<EventPreview[]> => {
    if (currentAccount.getType() == 'organization') {
        throw new ServiceError('You dont have permission.', 403);
    }
    const events = await eventdb.getAll();
    if (!events) {
        throw new ServiceError('Events not found', 404);
    }
    const eventSummaries: EventPreview[] = events.map((event) => {
        if (event.getCreator().getId() != currentAccount.getId()) {
            return event.toPrevieuw(currentAccount.getId() ?? 0);
        }
        return undefined;
    }).filter((event): event is EventPreview => event !== undefined);
    return eventSummaries;
}; 

const getCurrentAccountEvents = async (currentAccount : Account): Promise<EventPreview[]> => {
    if (currentAccount.getType() != 'user') {
        throw new ServiceError('Only accounts can have events', 403);
    }
    const events = await eventdb.getAll();
    if (!events) {
        throw new ServiceError('Events not found', 404);
    }
    const eventSummaries: EventPreview[] = events.map((event) => {
        if (event.getCreator().getId() === currentAccount.getId()) {
            return event.toPrevieuw(currentAccount.getId() ?? 0);
        }
        return undefined;
    }).filter((event): event is EventPreview => event !== undefined);
    return eventSummaries;
}; 

const getEventById = async (id: number, currentAccount : Account): Promise<EventSummary> => {
    const event = await eventdb.getById(id);
    if (!event) {
        throw new ServiceError('Event not found', 404);
    }
    return event.toSummary();
};
const deleteEventById = async (id: number, currentAccount : Account): Promise<void> => {
    const event = await eventdb.getById(id);
    if (!event) {
        throw new ServiceError('Event not found', 404);
    }
    if (currentAccount.getType() != 'admin' && event.getCreator().getId() !== currentAccount.getId()) {
        throw new ServiceError('Only creator can delete event', 403);
    }
    await eventdb.deleteEvent(id);
};
const createEvent = async (event: EventInput, currentAccount : Account): Promise<EventSummary> => {
    if (currentAccount.getType() == "admin") {
        throw new ServiceError('Only accounts can create events', 403);
    }

    let creator = currentAccount;
    event.creator = creator;

    if (event.activityName === undefined || event.activityName.trim() === '') {
        throw new ServiceError('Activity name is undefined', 400);   
    }

    let acitivity = await activityDb.getByName(event.activityName);
    if (!acitivity) {
        throw new ServiceError('Activity not found', 404);
    }
    
    event.creator = currentAccount;
    const newevent = Event.fromEventInput(event, acitivity);
    const savedevent = await eventdb.create(newevent);
    const eventSummary = savedevent.toSummary();
    return eventSummary;
};

const joinEvent = async (id: number, currentAccount: Account): Promise<EventSummary> => {
    if (currentAccount.getType() != 'user') {
        throw new ServiceError('Only accounts can join events', 403);
    }

    const event = await eventdb.getById(id);
    if (!event) {
        throw new ServiceError('Event not found', 404);
    }
    if (event.getCreator().getId() === currentAccount.getId()) {
        throw new ServiceError('Creator cannot join own event', 400);
    }
    if (event.getParticipants().some(participant => participant.getId() === currentAccount.getId())) {
        throw new ServiceError('Account already joined event', 400);
    }
    if (event.isFull()) {
        throw new ServiceError('Event is full', 400);
    }

    event.addParticipant(currentAccount);
    log(event);
    const updatedEvent = await eventdb.update(event);

    return updatedEvent.toSummary();
};

export default {
    getAllEvents,
    getCurrentAccountEvents,
    createEvent,
    joinEvent,
    getEventById,
    deleteEventById
};