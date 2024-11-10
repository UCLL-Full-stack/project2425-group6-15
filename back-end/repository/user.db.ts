import { User } from "../model/user";


const users: User[] = [];

const getAllUsers = (): User[] => users;

const createUser = (userData: User): User => {
    users.push(userData);  
    return userData;  
};
const getUserById = (id:number): User | null =>{
    const user = users.find(user => user.getId() === id);
    return user || null;
}
const getUserByEmail = (email: string): User | null => {
    const user = users.find(user => user.getEmail() === email);
    return user || null;
}
export default {
    getAllUsers,
    createUser,
    getUserById,
    getUserByEmail};