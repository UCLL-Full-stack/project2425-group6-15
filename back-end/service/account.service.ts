import { Account} from '../model/account'; 
import { AccountInput, AccountPreview, AccountSummary, PublicAccount } from '../types';
import accountDB from '../repository/account.db';
import interestdb from '../repository/interest.db';
import { Interest } from '../model/interest';
import { ServiceError } from './service.error';
import bcrypt from 'bcryptjs';
import { add } from 'date-fns';
import eventDb from '../repository/event.db';


const getAllAccounts = async (): Promise<Account[]> => accountDB.getAll();

const getCurrentAccount = async (currentAccount: Account): Promise<PublicAccount> => {
    currentAccount.setJoinedEvents(await eventDb.getByJoinedAccountId(currentAccount.getId() ?? 0));
    currentAccount.setEvents(await eventDb.getByCreatorId(currentAccount.getId() ?? 0));
    return currentAccount.toPublic();
}

const findAccountByEmail = async (email: string, currentAccount: Account): Promise<PublicAccount | AccountPreview > => {
    const account = await accountDB.getByEmail(email);
    if (!account) {
        throw new ServiceError('Account not found', 404);
    }

    if (currentAccount.equals(account)) {
        return account.toPublic(); 
    }
    
    return account.toPrevieuw();
};

const changeInterestOfAccount = async (currentAccount: Account, newInterests : string[]): Promise<Account> => {
    if(currentAccount.getType() !== 'user') {
        throw new ServiceError('Only users can change their interests', 403);
    }
    const account = await accountDB.getByEmail(currentAccount.getEmail());
    if (!account) {
        throw new ServiceError('Account not found', 404);
    }
    account.setInterests([]);

    const interestData = await Promise.all(newInterests.map(async (interest) => await interestdb.getByName(interest)));
    interestData.forEach((interest) => {
        if (interest) {
            account.addInterestToAccount(interest);
        }
    });

    await accountDB.update(account);
    return account;
};

const updateAccount = async (accountInput: AccountInput, currentAccount: Account): Promise<Account> => {
    const account = await accountDB.getByEmail(currentAccount.getEmail());
    if (!account) {
        throw new ServiceError('Account not found', 404);
    }

    // Check if username is already used
    const existingUsernameAccount = await accountDB.getByUsername(accountInput.username);
    if (existingUsernameAccount && existingUsernameAccount.getId() !== account.getId()) {
        throw new ServiceError('Username already in use', 409);
    }

    // Check if email is already used
    const existingEmailAccount = await accountDB.getByEmail(accountInput.email);
    if (existingEmailAccount && existingEmailAccount.getId() !== account.getId()) {
        throw new ServiceError('Email already in use', 409);
    }

    // Check if phone number is already used
    const existingPhoneNumberAccount = await accountDB.getByPhoneNumber(`${accountInput.phoneNumber.countryCode} ${accountInput.phoneNumber.number}`);
    if (existingPhoneNumberAccount && existingPhoneNumberAccount.getId() !== account.getId()) {
        throw new ServiceError('Phone number already in use', 409);
    }

    account.setFirstName(accountInput.firstName);
    account.setLastName(accountInput.lastName);
    account.setPhoneNumber(accountInput.phoneNumber);
    account.setUsername(accountInput.username);
    account.setEmail(accountInput.email);
    await accountDB.update(account);
    return account;
}

export default {
    getAllAccounts,
    findAccountByEmail,
    changeInterestOfAccount,
    getCurrentAccount,
    updateAccount
};