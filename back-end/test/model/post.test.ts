import { User } from "../../model/user";
import { Gender, PhoneNumber, Role } from "../../types";
import { Interest } from "../../model/interest";
import { Post } from "../../model/post";
import { Activity } from "../../model/activity";

const validUser = {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    phoneNumber: { countryCode: '+1', number: '123456789' },
    email: 'jane.doe@example.com',
    gender: 'female' as Gender,
    password: 'securepassword',
    interests: [],
    role: 'user' as Role,
    posts: [],
    joinedPosts: [],
};

const validActivity = {
    id: 2,
    name: 'name',
    type: 'type',
    posts: [],
};

const validPost = {
    id: 2,
    title: 'title',
    description: 'description',
    startDate: new Date(),
    endDate: new Date(),
    time: 'time',
    location: { longitude: 'longitude', latitude: 'latitude' },
    activity: new Activity(validActivity),
    creator: new User(validUser),
    participants: [new User(validUser)],
    peopleNeeded: 2,
};


test('given:valid values for post, when:post is created, then:post is created with those values', () => {
    const user = new User(validUser);
    const post = new Post(validPost);
    expect(validPost.id).toEqual(post.getId());
    expect(validPost.title).toEqual(post.getTitle());
    expect(validPost.description).toEqual(post.getDescription());
    expect(validPost.startDate).toEqual(post.getStartDate());
    expect(validPost.endDate).toEqual(post.getEndDate());
    expect(validPost.time).toEqual(post.getTime());
    expect(validPost.location).toEqual(post.getLocation());
    expect(validPost.activity).toEqual(post.getActivity());
    expect(validPost.creator).toEqual(post.getCreator());
    expect(validPost.participants).toEqual(post.getParticipants());
    expect(validPost.peopleNeeded).toEqual(post.getPeopleNeeded());
});

test('given:missing title, when:post is created, then:error is thrown', () => {
    const invalidPost = { ...validPost, title: '' };
    expect(() => new Post(invalidPost)).toThrow('Title is required');
});

test('given:participants exceed peopleNeeded, when:addParticipant is called, then:error is thrown', () => {
    const post = new Post(validPost);
    const newUser = new User({ ...validUser, id: 3 });
    post.addParticipant(newUser);
    expect(() => post.addParticipant(newUser)).toThrow('max participants.');
});

test('given:valid values, when:isFull is called, then:returns correct boolean', () => {
    const post = new Post(validPost);
    expect(post.isFull()).toBe(true);
    const newPost = new Post({ ...validPost, participants: [], peopleNeeded: 1 });
    expect(newPost.isFull()).toBe(false);
});

test('given:valid values, when:getPlacesLeft is called, then:returns correct number', () => {
    const post = new Post(validPost);
    expect(post.getPlacesLeft()).toBe(1);
    const newPost = new Post({ ...validPost, participants: [], peopleNeeded: 3 });
    expect(newPost.getPlacesLeft()).toBe(3);
});

test('given:valid values, when:toPrevieuw is called, then:returns correct preview object', () => {
    const post = new Post(validPost);
    const preview = post.toPrevieuw(validUser.id);
    expect(preview).toEqual({
        id: validPost.id,
        title: validPost.title,
        description: validPost.description,
        startDate: validPost.startDate,
        endDate: validPost.endDate,
        location: validPost.location,
        activity: validPost.activity,
        creator: validPost.creator.toSummary(),
        peopleNeeded: validPost.peopleNeeded,
        peopleJoined: validPost.participants.length,
        hasJoined: true,
    });
});

test('given:valid values, when:toSummary is called, then:returns correct summary object', () => {
    const post = new Post(validPost);
    const summary = post.toSummary();
    expect(summary).toEqual({
        id: validPost.id,
        title: validPost.title,
        description: validPost.description,
        startDate: validPost.startDate,
        endDate: validPost.endDate,
        time: validPost.time,
        location: validPost.location,
        activity: validPost.activity,
        creator: validPost.creator.toSummary(),
        participants: validPost.participants.map(participant => participant.toSummary()),
        peopleNeeded: validPost.peopleNeeded,
    });
});