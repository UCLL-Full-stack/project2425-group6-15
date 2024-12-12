import { User} from '../model/user'; 
import { ServiceError } from './service.error';
import interestdb from '../repository/interest.db';
import { Interest } from '../model/interest';

const getAll = async (currentUser : User): Promise<Interest[]> => {
    const interest = await interestdb.getAll();
    if (!interest) {
        throw new ServiceError('Posts not found', 404);
    }
    return interest;
}; 

const createInterest = async (interest: Interest, currentUser: User): Promise<void> => {
    if (currentUser.getRole() != 'admin') {
        throw new ServiceError('Only Admin users can add interests', 403);}
    if (!interest) throw new ServiceError('Interest is required');
    if (await interestdb.getByName(interest.getName())) {
        throw new ServiceError('Dublication of interest is not allowed');
    }
    await interestdb.create(interest);
};

export default {
    getAll,
    createInterest
};