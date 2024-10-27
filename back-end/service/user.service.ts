import { User} from '../model/user'; 
import { UserInput } from '../types';
import userDB from '../repository/user.db';

const getAllUsers = (): User[] => {
    return userDB.getAllUsers();
    }

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
    if (!userInput.rijkregisternummer) {
        throw new Error('Rijkregisternummer is required');
    }


    const user = new User({
        firstName: userInput.firstName,
        lastName: userInput.lastName,
        phoneNumber: userInput.phoneNumber,
        email: userInput.email,
        rijkregisternummer: userInput.rijkregisternummer
    });
    return userDB.createUser(user);
}

export default {getAllUsers,
    createUser
};