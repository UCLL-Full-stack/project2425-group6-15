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
    return event.toSummary(currentAccount.getId() ?? 0);
};

const deleteEventById = async (id: number, currentAccount : Account): Promise<void> => {
    const event = await eventdb.getById(id);
    if (!event) {
        throw new ServiceError('Event not found', 404);
    }
    if (currentAccount.getType() != 'admin' && event.getCreator().getId() !== currentAccount.getId()) {
        throw new ServiceError('Only creator can delete event', 403);
    }

    const currentDate = new Date();
    const timeDiff = event.getStartDate().getTime() - currentDate.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    if (currentDate > event.getStartDate() && currentDate < event.getEndDate()) {
        throw new ServiceError('Cannot delete event that has already started', 400);
    }

    if (currentDate > event.getEndDate() && currentAccount.getType() != 'admin') {
        throw new ServiceError('Cannot delete event that has already ended', 400);
    }

    if (hoursDiff < 8 && currentDate < event.getStartDate()) {
        throw new ServiceError('Cannot delete event that starts in less than 8 hours', 400);
    }

    await eventdb.deleteEvent(id);
};

const createEvent = async (event: EventInput, currentAccount : Account): Promise<EventSummary> => {
    if (currentAccount.getType() == "admin") {
        throw new ServiceError('Only accounts can create events', 403);
    }

    const currentDate = new Date();
    if (event.startDate < currentDate) {
        throw new ServiceError('Event date is in the past', 400);
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
    const eventSummary = savedevent.toSummary(currentAccount.getId() ?? 0);
    return eventSummary;
};

const updateEvent = async (id: number, event: EventInput, currentAccount : Account): Promise<EventSummary> => {
    const currentDate = new Date();
    const oldEvent = await eventdb.getById(id);
    if (!oldEvent) {
        throw new ServiceError('Event not found', 404);
    }
    if (event.startDate < currentDate) {
        throw new ServiceError('Event date is in the past', 400);
    }
    if (oldEvent.getCreator().getId() !== currentAccount.getId()) {
        throw new ServiceError('Only creator can update event', 403);
    }
    const timeDiff = oldEvent.getStartDate().getTime() - currentDate.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 12) {
        throw new ServiceError('Cannot update event that starts in less than 12 hours', 400);
    }
    if (hoursDiff < 24 && (event.startDate !== oldEvent.getStartDate() || event.endDate !== oldEvent.getEndDate())) {
        throw new ServiceError('Cannot change start or end date when event starts in less than 24 hours', 400);
    }
    if (hoursDiff < 48 && event.location !== oldEvent.getLocation()) {
        throw new ServiceError('Cannot change location when event starts in less than 48 hours', 400);
    }

    if (event.activityName === undefined || event.activityName.trim() === '') {
        throw new ServiceError('Activity name is undefined', 400);   
    }
    const activity = await activityDb.getByName(event.activityName);
    if (!activity) {
        throw new ServiceError('Activity not found', 404);
    }


    oldEvent.setTitle(event.title);
    oldEvent.setDescription(event.description);
    oldEvent.setStartDate(event.startDate);
    oldEvent.setEndDate(event.endDate);
    oldEvent.setLocation(event.location);
    oldEvent.setPeopleNeeded(event.peopleNeeded);
    oldEvent.setActivity(activity);
    
    const savedEvent = await eventdb.update(oldEvent);
    return savedEvent.toSummary(currentAccount.getId() ?? 0);
    
}
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
    const currentDate = new Date();
    if (event.getEndDate() && event.getEndDate() < currentDate) {
        throw new ServiceError('Event already ended', 400);
    }
    if (event.getStartDate() && event.getStartDate() < currentDate) {
        throw new ServiceError('Event already started', 400);
    }
    if (event.isFull()) {
        throw new ServiceError('Event is full', 400);
    }


    event.addParticipant(currentAccount);
    log(event);
    const updatedEvent = await eventdb.update(event);

    return updatedEvent.toSummary(currentAccount.getId() ?? 0);
};

const exitEvent = async (id: number, currentAccount: Account): Promise<void> => {
    if (currentAccount.getType() != 'user') {
        throw new ServiceError('Only accounts can exit events', 403);
    }
    const event = await eventdb.getById(id);
    if (!event) {
        throw new ServiceError('Event not found', 404);
    }

    if (!event.getParticipants().some(participant => participant.getId() === currentAccount.getId())) {
        throw new ServiceError('Account not joined event', 400);
    }

    event.removeParticipant(currentAccount);
    const updatedEvent = await eventdb.update(event);
};

export default {
    getAllEvents,
    getCurrentAccountEvents,
    createEvent,
    joinEvent,
    getEventById,
    deleteEventById,
    exitEvent,
    updateEvent
};