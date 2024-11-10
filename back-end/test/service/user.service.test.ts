
import { Interest } from '../../model/interest';
import { User } from '../../model/user';
import userDB from '../../repository/user.db';
import userService from '../../service/user.service';
import { UserInput } from '../../types';
import bcrypt from 'bcrypt';
import { anyString } from 'jest-mock-extended';

jest.mock('../../repository/user.db');


const validUserInput: UserInput = {
    firstName: 'Jane',
    lastName: 'Toe',
    phoneNumber: { countryCode: '32', number: '1244567890' },
    email: 'jane.toe@example.com',
    password: "password123",
    gender: 'female',
};

const mockUser = new User({
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: { countryCode: '32', number: '1234567890' },
    email: 'john.doe@example.com',
    password: 'password123',
    gender: 'male',
    interests: [],
});

beforeEach(() => {
    jest.clearAllMocks();
    (userDB.createUser as jest.Mock).mockResolvedValue(mockUser);
});

afterEach(() => {
    jest.clearAllMocks();
});   

test('given a valid user, when user is created, then user is created with those values', async () => {
    const createdUser = await userService.createUser(validUserInput);
    

    expect(userDB.createUser).toHaveBeenCalledTimes(1);
    expect(userDB.createUser).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'Jane',
        lastName: 'Toe',
        phoneNumber: { countryCode: '32', number: '1244567890' },
        email: 'jane.toe@example.com',
        password: anyString(),
        gender: 'female',
        interests: []
    }));
    expect(createdUser).toBeInstanceOf(User);
    expect(createdUser.getFirstName()).toEqual('John');
    expect(createdUser.getLastName()).toEqual('Doe');
    expect(createdUser.getEmail()).toEqual('john.doe@example.com');
});

test('given a user without first name, when user is created, then an error is thrown', async () => {
    const invalidUserInput = { ...validUserInput, firstName: '' };

    await expect(userService.createUser(invalidUserInput)).rejects.toThrow('First name is required');
    expect(userDB.createUser).not.toHaveBeenCalled();
});

test('given a user without last name, when user is created, then an error is thrown', async () => {
    const invalidUserInput = { ...validUserInput, lastName: '' };

    await expect(userService.createUser(invalidUserInput)).rejects.toThrow('Last name is required');
    expect(userDB.createUser).not.toHaveBeenCalled();
});

test('given a user without phone number, when user is created, then an error is thrown', async () => {
    const invalidUserInput = { ...validUserInput, phoneNumber: { countryCode: '', number: '' } };

    await expect(userService.createUser(invalidUserInput)).rejects.toThrow('Phone number is required');
    expect(userDB.createUser).not.toHaveBeenCalled();
});

test('given a user without email, when user is created, then an error is thrown', async () => {
    const invalidUserInput = { ...validUserInput, email: '' };

    await expect(userService.createUser(invalidUserInput)).rejects.toThrow('Email is required');
    expect(userDB.createUser).not.toHaveBeenCalled();
});

test('given a user without password, when user is created, then an error is thrown', async () => {
    const invalidUserInput = { ...validUserInput, password: '' };

    await expect(userService.createUser(invalidUserInput)).rejects.toThrow('Password is required');
    expect(userDB.createUser).not.toHaveBeenCalled();
});

test('given a user ID and interest, when interest is added, then user has that interest', async () => {
    const userId = 1;
    const interest = { name: 'Cycling' };
    const UserWithInterest = {
        ...mockUser,
        interests: [...mockUser.getInterests(), interest]
    };
        mockUser.addInterestToUser = jest.fn(interest => {
        mockUser.getInterests().push(interest);
        });
    (userDB.getUserById as jest.Mock).mockResolvedValue(mockUser);
    const updatedUser = await userService.addInterestToUser(userId, interest);
    

    expect(userDB.getUserById).toHaveBeenCalledTimes(1);
    expect(userDB.getUserById).toHaveBeenCalledWith(userId);
    expect(mockUser.addInterestToUser).toHaveBeenCalledTimes(1);
    expect(mockUser.addInterestToUser).toHaveBeenCalledWith(interest);
    expect(updatedUser.getInterests()).toContainEqual(interest);

}); 


test('given an invalid user ID, when interest is added, then an error is thrown', async () => {
    const userId = 999;
    const interest = { name: 'Cycling' };
    (userDB.getUserById as jest.Mock).mockResolvedValue(null);
    
    await expect(userService.addInterestToUser(userId, interest)).rejects.toThrow('User not found');
    expect(userDB.getUserById).toHaveBeenCalledTimes(1);
    expect(userDB.getUserById).toHaveBeenCalledWith(userId);
    expect(mockUser.addInterestToUser).not.toHaveBeenCalled();
});