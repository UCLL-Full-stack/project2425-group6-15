import { User} from '../model/user'; 
import { UserInput } from '../types';
import userDB from '../repository/user.db';
import { Interest } from '../model/interest';

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
  


    const user = new User({
        firstName: userInput.firstName,
        lastName: userInput.lastName,
        phoneNumber: userInput.phoneNumber,
        email: userInput.email,
        sex: userInput.sex,
        interests: []});
    return userDB.createUser(user);
}
const addInterestToUser =  (userId: number, interestData: { name: string }) => {
    const user = userDB.getUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const interest = new Interest(interestData);
    user.addInterestToUser(interest);
};

export default {getAllUsers,
    createUser, addInterestToUser
};