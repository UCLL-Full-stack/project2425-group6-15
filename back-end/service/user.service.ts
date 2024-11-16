import { User} from '../model/user'; 
import { UserInput, UserSummary } from '../types';
import userDB from '../repository/user.db';
import { Interest } from '../model/interest';
import { ServiceError } from './service.error';
import bcrypt from 'bcryptjs';

const createUser = async (userInput: UserInput): Promise<User> => {
    if (!userInput.firstName) {
        throw new ServiceError('First name is required');
    }
    if (!userInput.lastName) {
        throw new ServiceError('Last name is required');
    }
    if (!userInput.phoneNumber || !userInput.phoneNumber.countryCode || !userInput.phoneNumber.number) {

        throw new ServiceError('Phone number is required');

    }
    if (!userInput.email) {
        throw new ServiceError('Email is required');
    }
    if (!userInput.password) {
        throw new ServiceError('Password is required');
    }
    
    const hashedPassword = await bcrypt.hash(userInput.password, 10);

    const user = new User({
        firstName: userInput.firstName,
        lastName: userInput.lastName,
        phoneNumber: userInput.phoneNumber,
        email: userInput.email,
        gender: userInput.gender,
        password: hashedPassword,
        interests: [],
    });
    return userDB.createUser(user);
}

const getAllUsers = async (): Promise<User[]> => userDB.getAllUsers();


const findUserByEmail = async (email: string, currentUserEmail: string): Promise<User | UserSummary | null> => {
    const user = await userDB.getUserByEmail(email);
    if (!user) {
        throw new ServiceError('User not found', 404);
    }

    if (currentUserEmail === email) {
        return user; 
    }
    
    const userSummary: UserSummary = {
        firstName: user.getFirstName(),
        lastName: user.getLastName(),
        email: user.getEmail(),
        interests: user.getInterests(),
        gender: user.getGender()
};
    
    return userSummary;
};
async function addInterestToUser(userEmail: string, interestData: { name: string; description: string }) {
    const user = await userDB.getUserByEmail(userEmail);
    if (!user) {
        throw new ServiceError('User not found.');
    }
    const interest = new Interest(interestData);
    user.addInterestToUser(interest);
    await userDB.updatedUser(user);
    return user;
}

export default {
    createUser,
    getAllUsers,
    addInterestToUser,
    findUserByEmail
};