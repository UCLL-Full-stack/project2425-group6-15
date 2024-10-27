import { User} from '../model/user'; 
import { UserInput } from '../types';
import userDB from '../repository/user.db';
import { Interest } from '../model/interest';
import { JWTGivenToken } from '../authentication/auth.model';
import authService from '../authentication/auth.service';
import { error } from 'console';
import { ServiceError } from './service.error';
import { th } from 'date-fns/locale';

const createUser = async (userInput: UserInput): Promise<User> => {
    if (!userInput.firstName) {
        throw new Error('First name is required');
    }
    if (!userInput.lastName) {
        throw new Error('Last name is required');
    }
    if (!userInput.phoneNumber) {
        throw new Error('Phone number is required');
    }
    if (!userInput.email) {
        throw new Error('Email is required');
    }
    if (!userInput.password) {
        throw new Error('Password is required');
    }
    
    const user = new User({
        firstName: userInput.firstName,
        lastName: userInput.lastName,
        phoneNumber: userInput.phoneNumber,
        email: userInput.email,
        gender: userInput.gender,
        password: userInput.password,
        interests: []});
    return userDB.createUser(user);
}

const getAllUsers = (): User[] => {
    return userDB.getAllUsers();
    }


const findUserByEmail = (email: string,): User | null => {
    const user =  userDB.getUserByEmail(email);
    if (!user ) {
        throw new ServiceError('User not found', 404);
    }
    return user;
}

const addInterestToUser =  (userId: number, interestData: { name: string }) => {
    const user = userDB.getUserById(userId);
    if (!user) {
        throw new ServiceError('User not found');
    }
    const interest = new Interest(interestData);
    user.addInterestToUser(interest);
};

export default {createUser, getAllUsers, addInterestToUser, findUserByEmail};