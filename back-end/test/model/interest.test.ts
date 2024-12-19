import { Interest } from '../../model/interest';
import { Interest as InterestPrisma } from '@prisma/client';

const validInterest = {
    id: 1,
    name: 'Reading',
    description: 'Reading books',
};

test('given:valid values for interest, when:interest is created, then:interest is created with those values', () => {
    const interest = new Interest(validInterest);
    expect(validInterest.id).toEqual(interest.getId());
    expect(validInterest.name).toEqual(interest.getName());
    expect(validInterest.description).toEqual(interest.getDescription());
});

test('given:missing name, when:interest is created, then:error is thrown', () => {
    const invalidInterest = { ...validInterest, name: '' };
    expect(() => new Interest(invalidInterest)).toThrow('Interest must have a name');
});

test('given:missing description, when:interest is created, then:error is thrown', () => {
    const invalidInterest = { ...validInterest, description: '' };
    expect(() => new Interest(invalidInterest)).toThrow('Interest must have a description');
});

test('given:valid values, when:toSummary is called, then:returns correct summary object', () => {
    const interest = new Interest(validInterest);
    const summary = interest.toSummary();
    expect(summary).toEqual({
        id: validInterest.id,
        name: validInterest.name,
        description: validInterest.description,
        accounts: 0,
    });
});

test('given:valid values, when:toPrisma is called, then:returns correct prisma object', () => {
    const interest = new Interest(validInterest);
    const prismaInterest = interest.toPrisma();
    expect(prismaInterest).toEqual({
        id: validInterest.id,
        name: validInterest.name,
        description: validInterest.description,
    });
});

test('given:valid prisma object, when:fromPrisma is called, then:returns correct interest instance', () => {
    const prismaInterest: InterestPrisma = { id: 1, name: 'Reading', description: 'Reading books' };
    const interest = Interest.fromPrisma(prismaInterest);
    expect(interest.getId()).toBe(prismaInterest.id);
    expect(interest.getName()).toBe(prismaInterest.name);
    expect(interest.getDescription()).toBe(prismaInterest.description);
});
