import { Activity } from '../../model/activity';
import { Activity as ActivityPrisma } from '@prisma/client';

const validActivity = {
    id: 1,
    name: 'Test Activity',
    type: 'Test Type',
};

test('given:valid values for activity, when:activity is created, then:activity is created with those values', () => {
    const activity = new Activity(validActivity);
    expect(validActivity.id).toEqual(activity.getId());
    expect(validActivity.name).toEqual(activity.getName());
    expect(validActivity.type).toEqual(activity.getType());
});

test('given:missing name, when:activity is created, then:error is thrown', () => {
    const invalidActivity = { ...validActivity, name: '' };
    expect(() => new Activity(invalidActivity)).toThrow('Name is required');
});

test('given:missing type, when:activity is created, then:error is thrown', () => {
    const invalidActivity = { ...validActivity, type: '' };
    expect(() => new Activity(invalidActivity)).toThrow('Type is required');
});

test('given:valid values, when:toSummary is called, then:returns correct summary object', () => {
    const activity = new Activity(validActivity);
    const summary = activity.toSummary();
    expect(summary).toEqual({
        id: validActivity.id,
        name: validActivity.name,
        type: validActivity.type,
        events: 0,
    });
});

test('given:valid values, when:toPrisma is called, then:returns correct prisma object', () => {
    const activity = new Activity(validActivity);
    const prismaActivity = activity.toPrisma();
    expect(prismaActivity).toEqual({
        id: validActivity.id,
        name: validActivity.name,
        type: validActivity.type,
    });
});

test('given:valid prisma object, when:fromPrisma is called, then:returns correct activity instance', () => {
    const prismaActivity: ActivityPrisma = { id: 1, name: 'Test Activity', type: 'Test Type' };
    const activity = Activity.fromPrisma(prismaActivity);
    expect(activity.getId()).toBe(prismaActivity.id);
    expect(activity.getName()).toBe(prismaActivity.name);
    expect(activity.getType()).toBe(prismaActivity.type);
});
