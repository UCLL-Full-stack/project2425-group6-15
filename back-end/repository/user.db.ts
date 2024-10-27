import { User } from "../model/user";


const users: User[] = [];
const newUser = new User({
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    phoneNumber: { countryCode: '+1', number: '123456789' },
    email: 'jane.doe@example.com',
    gender: 'female',
    interests: []
});

users.push(newUser);
const getAllUsers = (): User[] => users;

const createUser = (userData: User): User => {
    users.push(userData);  
    return userData;  
};
const getUserById = (id:number): User | null =>{
    const user = users.find(user => user.getId() === id);
    return user || null;
}
export default {
    getAllUsers,
    createUser,
    getUserById};