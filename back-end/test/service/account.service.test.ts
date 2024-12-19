import { Interest } from '../../model/interest';
import { Account } from '../../model/account';
import accountDB from '../../repository/account.db';
import interestdb from '../../repository/interest.db';
import accountService from '../../service/account.service';
import { AccountInput, Role } from '../../types';
import bcrypt from 'bcrypt';
import { anyString } from 'jest-mock-extended';
import eventDb from '../../repository/event.db';
import { ServiceError } from '../../service/service.error';

jest.mock('../../repository/account.db');
jest.mock('../../repository/event.db');
jest.mock('../../repository/interest.db');

const validAccountInput: AccountInput = {
    username: ' jane.toe',
    firstName: 'Jane',
    lastName: 'Toe',
    phoneNumber: { countryCode: '32', number: '1244567890' },
    email: 'jane.toe@example.com',
};


const mockAccount = new Account({
    id: 2,
    type: 'user' as Role,
    username: 'janedoe',
    firstName: 'Jane',
    lastName: 'Doe',
    phoneNumber: { countryCode: '+1', number: '123456789' },
    email: 'jane.doe@example.com',
    password: 'securepassword',
    interests: [],
    events: [],
    joinedEvents: [],
});

beforeEach(() => {
    jest.clearAllMocks();
    (accountDB.create as jest.Mock).mockResolvedValue(mockAccount);
});

afterEach(() => {
    jest.clearAllMocks();
});



test('given a non-admin account, when getAllAccounts is called, then an error is thrown', async () => {
    const nonAdminAccount = new Account({ 
        ...mockAccount, 
        type: 'user' as Role,
        username: mockAccount.getUsername(),
        firstName: mockAccount.getFirstName(),
        lastName: mockAccount.getLastName(),
        phoneNumber: mockAccount.getPhoneNumber(),
        email: mockAccount.getEmail(),
        password: mockAccount.getPassword(),
        interests: mockAccount.getInterests(),
        events: mockAccount.getEvents(),
        joinedEvents: mockAccount.getJoinedEvents()
    });

    await expect(accountService.getAllAccounts(nonAdminAccount)).rejects.toThrow(ServiceError);
    await expect(accountService.getAllAccounts(nonAdminAccount)).rejects.toThrow('Only admins can view all accounts');
});

test('given an admin account, when getAllAccounts is called, then all accounts are returned', async () => {
    const adminAccount = new Account({ 
        ...mockAccount, 
        type: 'admin' as Role,
        username: mockAccount.getUsername(),
        firstName: mockAccount.getFirstName(),
        lastName: mockAccount.getLastName(),
        phoneNumber: mockAccount.getPhoneNumber(),
        email: mockAccount.getEmail(),
        password: mockAccount.getPassword(),
        interests: mockAccount.getInterests(),
        events: mockAccount.getEvents(),
        joinedEvents: mockAccount.getJoinedEvents()
    });
    const allAccounts = [mockAccount];
    (accountDB.getAll as jest.Mock).mockResolvedValue(allAccounts);

    const result = await accountService.getAllAccounts(adminAccount);

    expect(accountDB.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(allAccounts.map(account => account.toSummary()));
});

test('given a current account, when getCurrentAccount is called, then public account is returned', async () => {
    (eventDb.getByJoinedAccountId as jest.Mock).mockResolvedValue([]);
    (eventDb.getByCreatorId as jest.Mock).mockResolvedValue([]);

    const result = await accountService.getCurrentAccount(mockAccount);

    expect(eventDb.getByJoinedAccountId).toHaveBeenCalledWith(mockAccount.getId());
    expect(eventDb.getByCreatorId).toHaveBeenCalledWith(mockAccount.getId());
    expect(result).toEqual(mockAccount.toPublic());
});

test('given an email, when findAccountByEmail is called, then account is returned', async () => {
    (accountDB.getByEmail as jest.Mock).mockResolvedValue(mockAccount);

    const result = await accountService.findAccountByEmail(mockAccount.getEmail(), mockAccount);

    expect(accountDB.getByEmail).toHaveBeenCalledWith(mockAccount.getEmail());
    expect(result).toEqual(mockAccount.toPublic());
});

test('given an email, when findAccountByEmail is called with a different account, then account preview is returned', async () => {
    const differentAccount = new Account({ 
        ...mockAccount, 
        id: 3, 
        email: 'different@example.com',
        username: 'differentuser',
        firstName: 'Different',
        lastName: 'User',
        phoneNumber: { countryCode: '+1', number: '987654321' },
        password: 'anotherpassword',
        interests: [],
        events: [],
        joinedEvents: []
    });
    (accountDB.getByEmail as jest.Mock).mockResolvedValue(differentAccount);

    const result = await accountService.findAccountByEmail(differentAccount.getEmail(), mockAccount);

    expect(accountDB.getByEmail).toHaveBeenCalledWith(differentAccount.getEmail());
    expect(result).toEqual(differentAccount.toPrevieuw());
});

test('given a user account, when changeInterestOfAccount is called, then interests are updated', async () => {
    const newInterests = [ 'Swimming'];
    const interestObjects = newInterests.map(name => new Interest({ name, description: 'desc' }));
    (accountDB.getByEmail as jest.Mock).mockResolvedValue(mockAccount);
    (interestdb.getByName as jest.Mock).mockImplementation(name => interestObjects.find(interest => interest.getName() === name));

    const result = await accountService.changeInterestOfAccount(mockAccount, newInterests);

    expect(accountDB.getByEmail).toHaveBeenCalledWith(mockAccount.getEmail());
    expect(interestdb.getByName).toHaveBeenCalledTimes(newInterests.length);
    expect(result.getInterests()).toEqual(interestObjects);
});

test('given an account input, when updateAccount is called, then account is updated', async () => {
    (accountDB.getByEmail as jest.Mock).mockResolvedValue(mockAccount);
    (accountDB.getByUsername as jest.Mock).mockResolvedValue(null);
    (accountDB.getByPhoneNumber as jest.Mock).mockResolvedValue(null);

    const result = await accountService.updateAccount(validAccountInput, mockAccount);

    expect(accountDB.getByEmail).toHaveBeenCalledWith(mockAccount.getEmail());
    expect(accountDB.getByUsername).toHaveBeenCalledWith(validAccountInput.username);
    expect(accountDB.getByPhoneNumber).toHaveBeenCalledWith(`${validAccountInput.phoneNumber.countryCode} ${validAccountInput.phoneNumber.number}`);
    expect(result.getFirstName()).toEqual(validAccountInput.firstName);
    expect(result.getLastName()).toEqual(validAccountInput.lastName);
    expect(result.getEmail()).toEqual(validAccountInput.email);
});




