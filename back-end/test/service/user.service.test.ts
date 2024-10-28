
import { User } from '../../model/user';
import userDB from '../../repository/user.db';
import userService from '../../service/user.service';
import { UserInput } from '../../types';

jest.mock('../../repository/user.db');


const validUserInput: UserInput = {
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: { countryCode: '32', number: '1234567890' },
    email: 'john.doe@example.com',
    password: 'password123',
    gender: 'male'
};

const mockUser = new User({
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: { countryCode: '32', number: '1234567890' },
    email: 'john.doe@example.com',
    password: 'password123',
    gender: 'male',
    interests: []
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
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: { countryCode: '32', number: '1234567890' },
            email: 'john.doe@example.com',
            password: 'password123',
            gender: 'male',
            interests: []
        }));
        expect(createdUser).toBeInstanceOf(User);
        expect(createdUser.getFirstName()).toEqual('John');
        expect(createdUser.getLastName()).toEqual('Doe');
        expect(createdUser.getEmail()).toEqual('john.doe@example.com');
    });

    test('given a user ID and interest, when interest is added, then user has that interest', async () => {
        const userId = 1;
        const interest = { id: 1, name: 'Cycling' };
        const UserWithInterest = {
            ...mockUser,
            interests: [...mockUser.getInterests(), interest]
        };
        mockUser.addInterestToUser = jest.fn();
        (userDB.getUserById as jest.Mock).mockResolvedValue(mockUser);
        (mockUser.addInterestToUser as jest.Mock).mockResolvedValue(UserWithInterest);
        const updatedUser = await userService.addInterestToUser(userId, interest);
        
    
        expect(userDB.getUserById).toHaveBeenCalledTimes(1);
        expect(userDB.getUserById).toHaveBeenCalledWith(userId);
        expect(mockUser.addInterestToUser).toHaveBeenCalledTimes(1);
        expect(mockUser.addInterestToUser).toHaveBeenCalledWith(interest);
        // expect(updatedUser.getInterests()).toContainEqual(interest);

    }); 