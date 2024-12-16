import { User } from "../../model/user";
import { Gender, PhoneNumber, Role } from "../../types";
import { Interest } from "../../model/interest";

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

test('given:valid values for user, when:user is created, then:user is created with those values', () => {
    const user = new User(validUser);
    expect(validUser.id).toEqual(user.getId());
    expect(validUser.firstName).toEqual(user.getFirstName());
    expect(validUser.lastName).toEqual(user.getLastName());
    expect(validUser.phoneNumber).toEqual(user.getPhoneNumber());
    expect(validUser.email).toEqual(user.getEmail());
    expect(validUser.password).toEqual(user.getPassword());
    expect(validUser.gender).toEqual(user.getGender());
    expect(validUser.interests).toEqual(user.getInterests());
});

test('should throw an error if first name is missing', () => {
    expect(() => {
        new User({ ...validUser, firstName: "" });
    }).toThrow('First name is required');
});

test('should throw an error if last name is missing', () => {
    expect(() => {
        new User({ ...validUser, lastName: "" });
    }).toThrow('Last name is required');
});

test('should throw an error if email is missing', () => {
    expect(() => {
        new User({ ...validUser, email: "" });
    }).toThrow('Email is required');
});

test('should throw an error if country code is missing', () => {
    expect(() => {
        new User({ ...validUser, phoneNumber: { countryCode: '', number: '556446' } as PhoneNumber });
    }).toThrow('country code is required');
});

test('should throw an error if phone number is missing', () => {
    expect(() => {
        new User({ ...validUser, phoneNumber: { countryCode: '+1', number: '' } as PhoneNumber });
    }).toThrow('phone number is required');
});

test('should throw an error if password is missing', () => {
    expect(() => {
        new User({ ...validUser, password: "" });
    }).toThrow('Password is required');
});

test('should throw an error if gender is missing', () => {
    expect(() => {
        new User({ ...validUser, gender: "" as Gender });
    }).toThrow('Gender is required');
});

test('should add an interest to the validUser', () => {
    const user = new User(validUser);
    const interest = new Interest({ name: "Reading", description: "Reading books" });
    user.addInterestToUser(interest);
    expect(user.getInterests()).toContain(interest);
});

test('should throw an error if role is admin and gender is provided', () => {
    expect(() => {
        new User({ ...validUser, role: 'admin', gender: 'female' as Gender });
    }).toThrow('Only users can have a gender');
});

test('should throw an error if role is admin and interests are provided', () => {
    expect(() => {
        new User({ ...validUser, role: 'admin', gender : null, interests: [new Interest({ name: "Reading", description: "Reading books" })] });
    }).toThrow('Only users can have interests');
});


test('should return true if two validUsers are equal', () => {
    const validUser1 = new User(validUser);
    const validUser2 = new User(validUser);
    expect(validUser1.equals(validUser2)).toBe(true);
});

test('should return false if two validUsers are not equal', () => {
    const validUser1 = new User(validUser);
    const validUser2 = new User({ ...validUser, email: "john.doe@example.com" });
    expect(validUser1.equals(validUser2)).toBe(false);
});

test('should convert user to summary correctly', () => {
    const user = new User(validUser);
    const summary = user.toSummary();
    expect(summary.firstName).toEqual(validUser.firstName);
    expect(summary.lastName).toEqual(validUser.lastName);
    expect(summary.email).toEqual(validUser.email);
    expect(summary.gender).toEqual(validUser.gender);
    expect(summary.interests).toEqual(validUser.interests);
});

test('should convert user to prisma format correctly', () => {
    const user = new User(validUser);
    const prismaUser = user.toPrisma();
    expect(prismaUser.firstName).toEqual(validUser.firstName);
    expect(prismaUser.lastName).toEqual(validUser.lastName);
    expect(prismaUser.email).toEqual(validUser.email);
    expect(prismaUser.gender).toEqual(validUser.gender);
    expect(prismaUser.phoneNumber).toEqual(`${validUser.phoneNumber.countryCode} ${validUser.phoneNumber.number}`);
    expect(prismaUser.role).toEqual(validUser.role);
    expect(prismaUser.password).toEqual(validUser.password);
});






