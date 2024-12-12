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

export default {
    getAll,
};