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
const updatedUser = (userdata : User): User | null => {
    const user = users.find(user => user.getId() === userdata.getId());
    if(user){
        user.setFirstName(userdata.getFirstName());
        user.setLastName(userdata.getLastName());
        user.setPhoneNumber(userdata.getPhoneNumber());
        user.setEmail(userdata.getEmail());
        user.setGender(userdata.getGender());
        user.setPassword(userdata.getPassword());
        user.setInterests(userdata.getInterests());
        return user;
    }
    return null;
}
export default {
    getAllUsers,
    createUser,
    getUserById,
    getUserByEmail, 
    updatedUser};