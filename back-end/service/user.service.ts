import { User} from '../model/user'; 
import { UserInput, UserSummary } from '../types';
import userDB from '../repository/user.db';
import interestdb from '../repository/interest.db';
import { Interest } from '../model/interest';
import { ServiceError } from './service.error';
import bcrypt from 'bcryptjs';
import { add } from 'date-fns';

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
        posts: [],
        joinedPosts: [],
    });
    return userDB.create(user);
}

const getAllUsers = async (): Promise<User[]> => userDB.getAll();


const findUserByEmail = async (email: string, currentUser: User): Promise<User | UserSummary | null> => {
    const user = await userDB.getByEmail(email);
    if (!user) {
        throw new ServiceError('User not found', 404);
    }

    if (currentUser.getEmail() === email) {
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

const changeInterestOfUser = async (currentUser: User, newInterests : string[]): Promise<User> => {
    const user = await userDB.getByEmail(currentUser.getEmail());
    if (!user) {
        throw new ServiceError('User not found', 404);
    }
    user.setInterests([]);

    const interestData = await Promise.all(newInterests.map(async (interest) => await interestdb.getByName(interest)));
    interestData.forEach((interest) => {
        if (interest) {
            user.addInterestToUser(interest);
        }
    });

    await userDB.update(user);
    return user;
};


export default {
    createUser,
    getAllUsers,
    findUserByEmail,
    changeInterestOfUser,
};