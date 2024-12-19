import { Account } from '../../model/account';
import { Event } from '../../model/event';
import eventDb from '../../repository/event.db';
import activityDb from '../../repository/activity.db';
import eventService from '../../service/event.service';
import { EventInput, Role } from '../../types';
import { ServiceError } from '../../service/service.error';
import { Activity } from '../../model/activity';

jest.mock('../../repository/event.db');
jest.mock('../../repository/activity.db');

const mockAccount = new Account({
    id: 2,
    type: 'user' as Role,
    username: 'janedoe',
    firstName: 'Jane',
    lastName: 'Doe',
    phoneNumber: { countryCode: '+1', number: '123456789' },
    email: 'jane.doe@example.com',
    password: 'securepassword',
    interests: [],
    events: [],
    joinedEvents: [],
});

const anotherMockAccount = new Account({
    id: 3,
    type: 'user' as Role,
    username: 'johnsmith',
    firstName: 'John',
    lastName: 'Smith',
    phoneNumber: { countryCode: '+1', number: '987654321' },
    email: 'john.smith@example.com',
    password: 'anotherpassword',
    interests: [],
    events: [],
    joinedEvents: [],
});


const mockEvent = new Event({
    id: 1,
    title: 'Cycling Event',
    description: 'Outdoor cycling event',
    startDate: new Date(Date.now() + 13 * 60 * 60 * 10000), // 9 hours from now
    endDate: new Date(Date.now() + 16 * 60 * 60 * 10000), // 10 hours from now
    location: { longitude: 'longitude', latitude: 'latitude' },
    activity: new Activity({ id: 1, name: 'Cycling', type: 'Sport' }),
    creator: mockAccount,
    participants: [],
    peopleNeeded: 10,
});

beforeEach(() => {
    jest.clearAllMocks();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given a valid event, when createEvent is called, then event is created', async () => {
    (eventDb.create as jest.Mock).mockResolvedValue(mockEvent);
    (activityDb.getByName as jest.Mock).mockResolvedValue(mockEvent.getActivity());
    const result = await eventService.createEvent({
        title: mockEvent.getTitle(),
        description: mockEvent.getDescription(),
        startDate: mockEvent.getStartDate(),
        endDate: mockEvent.getEndDate(),
        location: mockEvent.getLocation(),
        activityName: mockEvent.getActivity().getName(),
        creator: mockAccount,
        peopleNeeded: mockEvent.getPeopleNeeded(),
    }, mockAccount);

    expect(result).toEqual(mockEvent.toSummary(mockAccount.getId() ?? 0));
});

test('given an event ID, when getEventById is called, then event is returned', async () => {
    (eventDb.getById as jest.Mock).mockResolvedValue(mockEvent);
    (eventDb.deleteEvent as jest.Mock).mockImplementation(() => {
        throw new ServiceError('Only creator can delete event');
    });

    const result = await eventService.getEventById(mockEvent.getId() ?? 0, mockAccount);

    expect(eventDb.getById).toHaveBeenCalledWith(mockEvent.getId());
    expect(result).toEqual(mockEvent.toSummary(mockAccount.getId() ?? 0));
});

test('given an invalid event ID, when getEventById is called, then an error is thrown', async () => {
    (eventDb.getById as jest.Mock).mockResolvedValue(null);

    await expect(eventService.getEventById(999, mockAccount)).rejects.toThrow(ServiceError);
});

test('given an event ID and account, when joinEvent is called and account already joined, then an error is thrown', async () => {
    mockEvent.addParticipant(anotherMockAccount);
    (eventDb.getById as jest.Mock).mockResolvedValue(mockEvent);

    await expect(eventService.joinEvent(mockEvent.getId() ?? 0, anotherMockAccount)).rejects.toThrow(ServiceError);
    await expect(eventService.joinEvent(mockEvent.getId() ?? 0, anotherMockAccount)).rejects.toThrow('Account already joined event');
});

test('given an event ID and creator account, when joinEvent is called, then an error is thrown', async () => {
    (eventDb.getById as jest.Mock).mockResolvedValue(mockEvent);

    await expect(eventService.joinEvent(mockEvent.getId() ?? 0, mockAccount)).rejects.toThrow(ServiceError);
    await expect(eventService.joinEvent(mockEvent.getId() ?? 0, mockAccount)).rejects.toThrow('Creator cannot join own event');
});


test('given an event ID and account, when leaveEvent is called, then account leaves the event', async () => {
    mockEvent.addParticipant(mockAccount);
    (eventDb.getById as jest.Mock).mockResolvedValue(mockEvent);
    (eventDb.update as jest.Mock).mockResolvedValue(mockEvent);

    await eventService.exitEvent(mockEvent.getId() ?? 0, mockAccount);

    expect(eventDb.getById).toHaveBeenCalledWith(mockEvent.getId());
    expect(eventDb.update).toHaveBeenCalledWith(mockEvent);
    expect(mockEvent.getParticipants()).not.toContain(mockAccount.getId());
});

test('given an event ID and account, when deleteEvent is called by non-creator, then an error is thrown', async () => {
    const nonCreatorAccount = new Account({
        ...mockAccount,
        id: 3,
        username: 'johnsmith',
        firstName: 'John',
        lastName: 'Smith',
        phoneNumber: { countryCode: '+1', number: '987654321' },
        email: 'john.smith@example.com',
        password: 'anotherpassword',
        interests: [],
        events: [],
        joinedEvents: [],
    });
    (eventDb.getById as jest.Mock).mockResolvedValue(mockEvent);

    await expect(eventService.deleteEventById(mockEvent.getId() ?? 0, nonCreatorAccount)).rejects.toThrow(ServiceError);
    await expect(eventService.deleteEventById(mockEvent.getId() ?? 0, nonCreatorAccount)).rejects.toThrow('Only creator can delete event');
});



test('given an organization account, when getAllEvents is called, then an error is thrown', async () => {
    const organizationAccount = new Account({
        id: mockAccount.getId(),
        type: 'organization' as Role,
        username: mockAccount.getUsername(),
        firstName: mockAccount.getFirstName(),
        lastName: mockAccount.getLastName(),
        phoneNumber: mockAccount.getPhoneNumber(),
        email: mockAccount.getEmail(),
        password: mockAccount.getPassword(),
        interests: mockAccount.getInterests(),
        events: mockAccount.getEvents(),
        joinedEvents: mockAccount.getJoinedEvents(),
    });

    await expect(eventService.getAllEvents(organizationAccount)).rejects.toThrow(ServiceError);
    await expect(eventService.getAllEvents(organizationAccount)).rejects.toThrow('You dont have permission.');
});

test('given a user account, when getCurrentAccountEvents is called, then user events are returned', async () => {
    const userEvents = [mockEvent];
    (eventDb.getAll as jest.Mock).mockResolvedValue(userEvents);

    const result = await eventService.getCurrentAccountEvents(mockAccount);

    expect(eventDb.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(userEvents.map(event => event.toPrevieuw(mockAccount.getId() ?? 0)));
});

test('given an event ID and account, when getEventById is called, then event is returned', async () => {
    (eventDb.getById as jest.Mock).mockResolvedValue(mockEvent);

    const result = await eventService.getEventById(mockEvent.getId() ?? 0, mockAccount);

    expect(eventDb.getById).toHaveBeenCalledWith(mockEvent.getId());
    expect(result).toEqual(mockEvent.toSummary(mockAccount.getId() ?? 0));
});


test('given a valid event, when createEvent is called, then event is created', async () => {
    (eventDb.create as jest.Mock).mockResolvedValue(mockEvent);
    (activityDb.getByName as jest.Mock).mockResolvedValue(mockEvent.getActivity());
    const result = await eventService.createEvent({
        title: mockEvent.getTitle(),
        description: mockEvent.getDescription(),
        startDate: mockEvent.getStartDate(),
        endDate: mockEvent.getEndDate(),
        location: mockEvent.getLocation(),
        activityName: mockEvent.getActivity().getName(),
        peopleNeeded: mockEvent.getPeopleNeeded(),
    }, mockAccount);

    expect(result).toEqual(mockEvent.toSummary(mockAccount.getId() ?? 0));
});

test('given an event ID, when getEventById is called, then event is returned', async () => {
    (eventDb.getById as jest.Mock).mockResolvedValue(mockEvent);

    const result = await eventService.getEventById(mockEvent.getId() ?? 0, mockAccount);

    expect(eventDb.getById).toHaveBeenCalledWith(mockEvent.getId());
    expect(result).toEqual(mockEvent.toSummary(mockAccount.getId() ?? 0));
});



test('given a valid event ID, when deleteEventById is called by a non-creator, then an error is thrown', async () => {
    const anotherAccount = new Account({
        id: 2,
        type: mockAccount.getType(),
        username: 'anotheruser',
        firstName: 'Another',
        lastName: 'User',
        phoneNumber: { countryCode: '+1', number: '123456789' },
        email: 'another.user@example.com',
        password: 'anotherpassword',
        interests: [],
        events: [],
        joinedEvents: [],
    });
    (eventDb.getById as jest.Mock).mockResolvedValue(mockEvent);

    await expect(eventService.deleteEventById(mockEvent.getId() ?? 0, anotherAccount)).rejects.toThrow(ServiceError);
});



test('given a valid event ID, when exitEvent is called, then account is removed from participants', async () => {
    mockEvent.addParticipant(mockAccount);
    (eventDb.getById as jest.Mock).mockResolvedValue(mockEvent);
    (eventDb.update as jest.Mock).mockResolvedValue(mockEvent);
    
    await eventService.exitEvent(mockEvent.getId() ?? 0, mockAccount);

    expect(eventDb.getById).toHaveBeenCalledWith(mockEvent.getId());
    expect(eventDb.update).toHaveBeenCalled();
    expect(mockEvent.getParticipants()).not.toContain(mockAccount.getId());
});

test('given a valid event ID and input, when updateEvent is called, then event is updated', async () => {
    const eventInput: EventInput = {
        title: 'Updated Event',
        description: 'Updated Event Description',
        startDate: new Date(Date.now() + 86400000), // 1 day from now
        endDate: new Date(Date.now() + 172800000), // 2 days from now
        location: { latitude: '0', longitude: '0' },
        activityName: 'Activity',
        peopleNeeded: 10,
    };
    (eventDb.getById as jest.Mock).mockResolvedValue(mockEvent);
    (activityDb.getByName as jest.Mock).mockResolvedValue({ name: 'Activity', description: 'Activity Description' });
    (eventDb.update as jest.Mock).mockResolvedValue(mockEvent);

    const result = await eventService.updateEvent(mockEvent.getId() ?? 0, eventInput, mockAccount);

    expect(eventDb.getById).toHaveBeenCalledWith(mockEvent.getId());
    expect(eventDb.update).toHaveBeenCalled();
    expect(result).toEqual(mockEvent.toSummary(mockAccount.getId() ?? 0));
});



test('given a valid account, when getCurrentAccountEvents is called, then current account events are returned', async () => {
    (eventDb.getAll as jest.Mock).mockResolvedValue([mockEvent]);

    const result = await eventService.getCurrentAccountEvents(mockAccount);

    expect(eventDb.getAll).toHaveBeenCalled();
    expect(result).toEqual([mockEvent.toPrevieuw(mockAccount.getId() ?? 0)]);
});

