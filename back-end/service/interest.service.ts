import { Account} from '../model/account'; 
import { ServiceError } from './service.error';
import interestdb from '../repository/interest.db';
import { Interest } from '../model/interest';
import { InterestSummary } from '../types';
import accountDb from '../repository/account.db';

const getAll = async (currentAccount : Account): Promise<Interest[]> => {
    const interest = await interestdb.getAll();
    if (!interest) {
        throw new ServiceError('Events not found', 404);
    }
    return interest;
}; 

const createInterest = async (interest: Interest, currentAccount: Account): Promise<void> => {
    if (currentAccount.getType() != 'admin') {
        throw new ServiceError('Only Admin accounts can add interests', 403);}
    if (!interest) throw new ServiceError('Interest is required');
    if (await interestdb.getByName(interest.getName())) {
        throw new ServiceError('Dublication of interest is not allowed');
    }
    await interestdb.create(interest);
};

const getAllInterestsForAdmin = async (currentAccount : Account): Promise<InterestSummary[]> => {
    if (currentAccount.getType() !== 'admin') {
        throw new ServiceError('Only admins can view all interests', 403);
    }
    const interests = await interestdb.getAll();
    let interestSummaries = interests.map(interest => interest.toSummary());
    await Promise.all(interestSummaries.map(async (interest) => {
        let accounts = await accountDb.getAllWithInterest(interest.id ?? 0);
        interest.accounts = accounts.length;
    }));
    return interestSummaries;
}

const deleteInterest = async (id: number, currentAccount : Account): Promise<void> => {
    if (currentAccount.getType() !== 'admin') {
        throw new ServiceError('Only admins can delete interests', 403);
    }
    const interest = await interestdb.getById(id);
    if (!interest) {
        throw new ServiceError('Interest not found', 404);
    }
    const accounts = await accountDb.getAllWithInterest(interest.getId() ?? 0);
    if (accounts.length > 0) {
        throw new ServiceError('Interest is in use', 403);
    }
    await interestdb.deleteById(id);
}

export default {
    getAll,
    createInterest,
    getAllInterestsForAdmin,
    deleteInterest
};