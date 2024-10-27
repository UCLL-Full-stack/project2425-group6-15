import { User } from "../model/user";


const users: User[] = [];
const getAllUsers = (): User[] => users;

const createUser = (userData: User): User => {
    users.push(userData);  
    return userData;  
};

export default {
    getAllUsers,
    createUser};