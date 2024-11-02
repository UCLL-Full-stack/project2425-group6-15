import { User } from "../../model/user";
import { Gender, PhoneNumber } from "../../types";
import { Interest } from "../../model/interest";


const validUser = {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    phoneNumber: { countryCode: '+1', number: '123456789' },
    email: 'jane.doe@example.com',
    gender: 'female' as Gender,
    password: 'securepassword',
    interests: []
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


test('should throw an error if gender is missing', () => {
    expect(() => {
        new User({ ...validUser, gender: "" as Gender });
    }).toThrow('Gender is required');
});

test('should add an interest to the validUser', () => {
    const user = new User(validUser);
    const interest = new Interest({ name: "Reading" });
    user.addInterestToUser(interest);
    expect(user.getInterests()).toContain(interest);
});

test('should throw an error if interest already exists', () => {
    const user = new User(validUser);
    const interest = new Interest({ name: "Reading" });
    user.addInterestToUser(interest);
    expect(() => {
        user.addInterestToUser(interest);
    }).toThrow('Interest already exists');
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

    
    
    


