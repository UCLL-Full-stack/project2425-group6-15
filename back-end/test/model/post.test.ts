import { Account } from "../../model/account";
import { PhoneNumber, Role } from "../../types";
import { Interest } from "../../model/interest";
import { Event } from "../../model/event";
import { Activity } from "../../model/activity";

const validAccount = {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    phoneNumber: { countryCode: '+1', number: '123456789' },
    email: 'jane.doe@example.com',
    password: 'securepassword',
    interests: [],
    role: 'account' as Role,
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
    endDate: new Date(),
    location: { longitude: 'longitude', latitude: 'latitude' },
    activity: new Activity(validActivity),
    creator: new Account(validAccount),
    participants: [new Account(validAccount)],
    peopleNeeded: 2,
};


test('given:valid values for event, when:event is created, then:event is created with those values', () => {
    const account = new Account(validAccount);
    const event = new Event(validEvent);
    expect(validEvent.id).toEqual(event.getId());
    expect(validEvent.title).toEqual(event.getTitle());
    expect(validEvent.description).toEqual(event.getDescription());
    expect(validEvent.startDate).toEqual(event.getStartDate());
    expect(validEvent.endDate).toEqual(event.getEndDate());
    expect(validEvent.time).toEqual(event.getTime());
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
    event.addParticipant(newAccount);
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
    expect(event.getPlacesLeft()).toBe(1);
    const newEvent = new Event({ ...validEvent, participants: [], peopleNeeded: 3 });
    expect(newEvent.getPlacesLeft()).toBe(3);
});

test('given:valid values, when:toPrevieuw is called, then:returns correct preview object', () => {
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
        creator: validEvent.creator.toSummary(),
        peopleNeeded: validEvent.peopleNeeded,
        peopleJoined: validEvent.participants.length,
        hasJoined: true,
    });
});

test('given:valid values, when:toSummary is called, then:returns correct summary object', () => {
    const event = new Event(validEvent);
    const summary = event.toSummary();
    expect(summary).toEqual({
        id: validEvent.id,
        title: validEvent.title,
        description: validEvent.description,
        startDate: validEvent.startDate,
        endDate: validEvent.endDate,
        time: validEvent.time,
        location: validEvent.location,
        activity: validEvent.activity,
        creator: validEvent.creator.toSummary(),
        participants: validEvent.participants.map(participant => participant.toSummary()),
        peopleNeeded: validEvent.peopleNeeded,
    });
});