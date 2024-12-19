import { Account } from '../../model/account';
import { PhoneNumber, Role } from '../../types';
import { Interest } from '../../model/interest';
import { Event } from '../../model/event';
import { Activity } from '../../model/activity';

const validAccount = {
    id: 2,
    type: 'user' as Role,
    username: 'janedoe',
    firstName: 'Jane',
    lastName: 'Doe',
    phoneNumber: { countryCode: '+1', number: '123456789' },
    email: 'jane.doe@example.com',
    password: 'securepassword',
    interests: [],
    role: 'user' as Role,
    events: [],
    joinedEvents: [],
};

const validActivity = {
    id: 2,
    name: 'name',
    type: 'type',
    events: [],
};

const validEvent = {
    id: 2,
    title: 'title',
    description: 'description',
    startDate: new Date(),
    endDate: new Date(+new Date() + 100000),
    location: { longitude: 'longitude', latitude: 'latitude' },
    activity: new Activity(validActivity),
    creator: new Account(validAccount),
    participants: [new Account(validAccount)],
    peopleNeeded: 1,
};
const validEvent2 = {
    id: 2,
    title: 'title',
    description: 'description',
    startDate: new Date(),
    endDate: new Date(+new Date() + 100000),
    location: { longitude: 'longitude', latitude: 'latitude' },
    activity: new Activity(validActivity),
    creator: new Account(validAccount),
    participants: [new Account(validAccount), new Account({ ...validAccount, id: 3 })],
    peopleNeeded: 2,
};

test('given:valid values for event, when:event is created, then:event is created with those values', () => {
    const event = new Event(validEvent);
    expect(validEvent.id).toEqual(event.getId());
    expect(validEvent.title).toEqual(event.getTitle());
    expect(validEvent.description).toEqual(event.getDescription());
    expect(validEvent.startDate).toEqual(event.getStartDate());
    expect(validEvent.endDate).toEqual(event.getEndDate());
    expect(validEvent.location).toEqual(event.getLocation());
    expect(validEvent.activity).toEqual(event.getActivity());
    expect(validEvent.creator).toEqual(event.getCreator());
    expect(validEvent.participants).toEqual(event.getParticipants());
    expect(validEvent.peopleNeeded).toEqual(event.getPeopleNeeded());
});

test('given:missing title, when:event is created, then:error is thrown', () => {
    const invalidEvent = { ...validEvent, title: '' };
    expect(() => new Event(invalidEvent)).toThrow('Title is required');
});

test('given:participants exceed peopleNeeded, when:addParticipant is called, then:error is thrown', () => {
    const event = new Event(validEvent);
    const newAccount = new Account({ ...validAccount, id: 3 });
    expect(() => event.addParticipant(newAccount)).toThrow('max participants.');
});

test('given:valid values, when:isFull is called, then:returns correct boolean', () => {
    const event = new Event(validEvent);
    expect(event.isFull()).toBe(true);
    const newEvent = new Event({ ...validEvent, participants: [], peopleNeeded: 1 });
    expect(newEvent.isFull()).toBe(false);
});

test('given:valid values, when:getPlacesLeft is called, then:returns correct number', () => {
    const event = new Event(validEvent);
    expect(event.getPlacesLeft()).toBe(0);
    const newEvent = new Event({ ...validEvent, participants: [], peopleNeeded: 3 });
    expect(newEvent.getPlacesLeft()).toBe(3);
});

test('given:valid values, when:toPreview is called, then:returns correct preview object', () => {
    const event = new Event(validEvent);
    const preview = event.toPrevieuw(validAccount.id);
    expect(preview).toEqual({
        id: validEvent.id,
        title: validEvent.title,
        description: validEvent.description,
        startDate: validEvent.startDate,
        endDate: validEvent.endDate,
        location: validEvent.location,
        activity: validEvent.activity,
        creator: validEvent.creator.toPrevieuw(),
        peopleNeeded: validEvent.peopleNeeded,
        peopleJoined: validEvent.participants.length,
        hasJoined: true,
    });
});

test('given:valid values, when:toSummary is called, then:returns correct summary object', () => {
    const event = new Event(validEvent);
    const summary = event.toSummary(validAccount.id);
    expect(summary).toEqual({
        id: validEvent.id,
        title: validEvent.title,
        description: validEvent.description,
        startDate: validEvent.startDate,
        endDate: validEvent.endDate,
        location: validEvent.location,
        activity: validEvent.activity,
        creator: validEvent.creator.toSummary(),
        participants: validEvent.participants.map((participant) => participant.toSummary()),
        peopleNeeded: validEvent.peopleNeeded,
        hasJoined: true,
    });
});

test('given:valid values, when:setTitle is called, then:title is updated', () => {
    const event = new Event(validEvent);
    event.setTitle('new title');
    expect(event.getTitle()).toEqual('new title');
});

test('given:empty title, when:setTitle is called, then:error is thrown', () => {
    const event = new Event(validEvent);
    expect(() => event.setTitle('')).toThrow('Title is required');
});

test('given:valid values, when:setDescription is called, then:description is updated', () => {
    const event = new Event(validEvent);
    event.setDescription('new description');
    expect(event.getDescription()).toEqual('new description');
});

test('given:empty description, when:setDescription is called, then:error is thrown', () => {
    const event = new Event(validEvent);
    expect(() => event.setDescription('')).toThrow('Description is required');
});

test('given:valid values, when:setStartDate is called, then:startDate is updated', () => {
    const event = new Event(validEvent);
    const newStartDate = new Date(validEvent.endDate.getTime() - 100000);
    event.setStartDate(newStartDate);
    expect(event.getStartDate()).toEqual(newStartDate);
});

test('given:startDate after endDate, when:setStartDate is called, then:error is thrown', () => {
    const event = new Event(validEvent);
    const invalidStartDate = new Date(validEvent.endDate.getTime() + 100000);
    expect(() => event.setStartDate(invalidStartDate)).toThrow(
        'Start date must be before end date'
    );
});

test('given:valid values, when:setEndDate is called, then:endDate is updated', () => {
    const event = new Event(validEvent);
    const newEndDate = new Date(validEvent.startDate.getTime() + 200000);
    event.setEndDate(newEndDate);
    expect(event.getEndDate()).toEqual(newEndDate);
});

test('given:endDate before startDate, when:setEndDate is called, then:error is thrown', () => {
    const event = new Event(validEvent);
    const invalidEndDate = new Date(validEvent.startDate.getTime() - 100000);
    expect(() => event.setEndDate(invalidEndDate)).toThrow('End date must be after start date');
});

test('given:valid values, when:setPeopleNeeded is called, then:peopleNeeded is updated', () => {
    const event = new Event(validEvent);
    event.setPeopleNeeded(3);
    expect(event.getPeopleNeeded()).toEqual(3);
});

test('given:peopleNeeded less than participants, when:setPeopleNeeded is called, then:error is thrown', () => {
    const event = new Event(validEvent2);
    expect(() => event.setPeopleNeeded(1)).toThrow(
        'People needed must be greater than or equal to number of participants'
    );
});

test('given:valid values, when:removeParticipant is called, then:participant is removed', () => {
    const event = new Event(validEvent);
    const account = new Account(validAccount);
    event.removeParticipant(account);
    expect(event.getParticipants().length).toEqual(0);
});

test('given:valid values, when:toPublic is called, then:returns correct public object', () => {
    const event = new Event(validEvent);
    const publicEvent = event.toPublic(validAccount.id);
    expect(publicEvent).toEqual({
        id: validEvent.id,
        title: validEvent.title,
        description: validEvent.description,
        startDate: validEvent.startDate,
        endDate: validEvent.endDate,
        location: validEvent.location,
        activity: validEvent.activity,
        creator: validEvent.creator.toSummary(),
        participants: validEvent.participants.map((participant) => participant.toPrevieuw()),
        peopleNeeded: validEvent.peopleNeeded,
        hasJoined: true,
    });
});
