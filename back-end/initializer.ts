import userDB from './repository/user.db';
import { User } from './model/user';
import { Interest } from './model/interest';
import bcrypt from 'bcryptjs';

const initializeData = async () => {
    const hashedPassword = await bcrypt.hash('user123', 10);

    const user1 = new User({
        id: 1,
        firstName: 'User',
        lastName: 'One',
        phoneNumber: { countryCode: '+1', number: '123456789' },
        email: 'user.one@example.com',
        gender: 'male',
        password: hashedPassword,
        interests: [],
        buddys: []
    });

    const user2 = new User({
        id: 2,
        firstName: 'User',
        lastName: 'Two',
        phoneNumber: { countryCode: '+1', number: '987654321' },
        email: 'user.two@example.com',
        gender: 'female',
        password: hashedPassword,
        interests: [],
        buddys: []
    });

    const interest1 = new Interest({ name: 'Reading' });
    const interest2 = new Interest({ name: 'Traveling' });

    user1.addInterestToUser(interest1);
    user2.addInterestToUser(interest2);

    userDB.createUser(user1);
    userDB.createUser(user2);

    console.log('Initial data has been added to the database');
};

export default initializeData;