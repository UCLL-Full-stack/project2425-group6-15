import { Interest } from '../../model/interest';
import { Account } from '../../model/account';
import accountDB from '../../repository/account.db';
import accountService from '../../service/account.service';
import { AccountInput } from '../../types';
import bcrypt from 'bcrypt';
import { anyString } from 'jest-mock-extended';

jest.mock('../../repository/account.db');

const validAccountInput: AccountInput = {
    firstName: 'Jane',
    lastName: 'Toe',
    phoneNumber: { countryCode: '32', number: '1244567890' },
    email: 'jane.toe@example.com',
    password: "password123",
    gender: 'female',
};

const mockAccount = new Account({
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: { countryCode: '32', number: '1234567890' },
    email: 'john.doe@example.com',
    password: 'password123',
    gender: 'male',
    interests: [],
});

beforeEach(() => {
    jest.clearAllMocks();
    (accountDB.createAccount as jest.Mock).mockResolvedValue(mockAccount);
});

afterEach(() => {
    jest.clearAllMocks();
});   

test('given a valid account, when account is created, then account is created with those values', async () => {
    const createdAccount = await accountService.createAccount(validAccountInput);
    
    expect(accountDB.createAccount).toHaveBeenCalledTimes(1);
    expect(accountDB.createAccount).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'Jane',
        lastName: 'Toe',
        phoneNumber: { countryCode: '32', number: '1244567890' },
        email: 'jane.toe@example.com',
        password: anyString(),
        gender: 'female',
        interests: []
    }));
    expect(createdAccount).toBeInstanceOf(Account);
    expect(createdAccount.getFirstName()).toEqual('John');
    expect(createdAccount.getLastName()).toEqual('Doe');
    expect(createdAccount.getEmail()).toEqual('john.doe@example.com');
});

test('given a account without first name, when account is created, then an error is thrown', async () => {
    const invalidAccountInput = { ...validAccountInput, firstName: '' };

    await expect(accountService.createAccount(invalidAccountInput)).rejects.toThrow('First name is required');
    expect(accountDB.createAccount).not.toHaveBeenCalled();
});

test('given a account without last name, when account is created, then an error is thrown', async () => {
    const invalidAccountInput = { ...validAccountInput, lastName: '' };

    await expect(accountService.createAccount(invalidAccountInput)).rejects.toThrow('Last name is required');
    expect(accountDB.createAccount).not.toHaveBeenCalled();
});

test('given a account without phone number, when account is created, then an error is thrown', async () => {
    const invalidAccountInput = { ...validAccountInput, phoneNumber: { countryCode: '', number: '' } };

    await expect(accountService.createAccount(invalidAccountInput)).rejects.toThrow('Phone number is required');
    expect(accountDB.createAccount).not.toHaveBeenCalled();
});

test('given a account without email, when account is created, then an error is thrown', async () => {
    const invalidAccountInput = { ...validAccountInput, email: '' };

    await expect(accountService.createAccount(invalidAccountInput)).rejects.toThrow('Email is required');
    expect(accountDB.createAccount).not.toHaveBeenCalled();
});

test('given a account without password, when account is created, then an error is thrown', async () => {
    const invalidAccountInput = { ...validAccountInput, password: '' };

    await expect(accountService.createAccount(invalidAccountInput)).rejects.toThrow('Password is required');
    expect(accountDB.createAccount).not.toHaveBeenCalled();
});

test('given a account ID and interest, when interest is added, then account has that interest', async () => {
    const accountId = 1;
    const interest = { name: 'Cycling', description: 'Outdoor activity' }; 
    const AccountWithInterest = {
        ...mockAccount,
        interests: [...mockAccount.getInterests(), interest]
    };
    mockAccount.addInterestToAccount = jest.fn(interest => {
        mockAccount.getInterests().push(interest);
    });
    (accountDB.getAccountById as jest.Mock).mockResolvedValue(mockAccount);
    const updatedAccount = await accountService.addInterestToAccount(accountId, interest);
    
    expect(accountDB.getAccountById).toHaveBeenCalledTimes(1);
    expect(accountDB.getAccountById).toHaveBeenCalledWith(accountId);
    expect(mockAccount.addInterestToAccount).toHaveBeenCalledTimes(1);
    expect(mockAccount.addInterestToAccount).toHaveBeenCalledWith(interest);
    expect(updatedAccount.getInterests()).toContainEqual(interest);
}); 

test('given an invalid account ID, when interest is added, then an error is thrown', async () => {
    const accountId = 999;
    const interest = { name: 'Cycling', description: 'Outdoor activity' };
    (accountDB.getAccountById as jest.Mock).mockResolvedValue(null);
    
    await expect(accountService.addInterestToAccount(accountId, interest)).rejects.toThrow('Account not found');
    expect(accountDB.getAccountById).toHaveBeenCalledTimes(1);
    expect(accountDB.getAccountById).toHaveBeenCalledWith(accountId);
    expect(mockAccount.addInterestToAccount).not.toHaveBeenCalled();
});