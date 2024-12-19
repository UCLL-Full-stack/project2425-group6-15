import { Account } from '../../model/account';
import { Interest } from '../../model/interest';
import interestDb from '../../repository/interest.db';
import accountDb from '../../repository/account.db';
import interestService from '../../service/interest.service';
import { Role } from '../../types';
import { ServiceError } from '../../service/service.error';

jest.mock('../../repository/interest.db');
jest.mock('../../repository/account.db');

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

const mockInterest = new Interest({
    id: 1,
    name: 'Cycling',
    description: 'Outdoor activity',
});

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

beforeEach(() => {
    jest.clearAllMocks();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given a non-admin account, when getAllInterestsForAdmin is called, then an error is thrown', async () => {
    await expect(interestService.getAllInterestsForAdmin(mockAccount)).rejects.toThrow(ServiceError);
    await expect(interestService.getAllInterestsForAdmin(mockAccount)).rejects.toThrow('Only admins can view all interests');
});

test('given an admin account, when getAllInterestsForAdmin is called, then all interests are returned', async () => {
    const allInterests = [mockInterest];
    (interestDb.getAll as jest.Mock).mockResolvedValue(allInterests);
    (accountDb.getAllWithInterest as jest.Mock).mockResolvedValue([]);

    const result = await interestService.getAllInterestsForAdmin(adminAccount);

    expect(interestDb.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(allInterests.map(interest => ({
        ...interest.toSummary(),
        accounts: 0
    })));
});

test('given a non-admin account, when deleteInterest is called, then an error is thrown', async () => {
    await expect(interestService.deleteInterest(mockInterest.getId() ?? 0, mockAccount)).rejects.toThrow(ServiceError);
    await expect(interestService.deleteInterest(mockInterest.getId() ?? 0, mockAccount)).rejects.toThrow('Only admins can delete interests');
});

test('given an admin account, when deleteInterest is called with an interest in use, then an error is thrown', async () => {
    (interestDb.getById as jest.Mock).mockResolvedValue(mockInterest);
    (accountDb.getAllWithInterest as jest.Mock).mockResolvedValue([{}]);

    await expect(interestService.deleteInterest(mockInterest.getId() ?? 0, adminAccount)).rejects.toThrow(ServiceError);
    await expect(interestService.deleteInterest(mockInterest.getId() ?? 0, adminAccount)).rejects.toThrow('Interest is in use');
});

test('given an admin account, when deleteInterest is called with a non-existent interest, then an error is thrown', async () => {
    (interestDb.getById as jest.Mock).mockResolvedValue(null);

    await expect(interestService.deleteInterest(999, adminAccount)).rejects.toThrow(ServiceError);
    await expect(interestService.deleteInterest(999, adminAccount)).rejects.toThrow('Interest not found');
});

test('given an admin account, when deleteInterest is called with a valid interest, then interest is deleted', async () => {
    (interestDb.getById as jest.Mock).mockResolvedValue(mockInterest);
    (accountDb.getAllWithInterest as jest.Mock).mockResolvedValue([]);

    await interestService.deleteInterest(mockInterest.getId() ?? 0, adminAccount);

    expect(interestDb.getById).toHaveBeenCalledWith(mockInterest.getId());
    expect(accountDb.getAllWithInterest).toHaveBeenCalledWith(mockInterest.getId());
    expect(interestDb.deleteById).toHaveBeenCalledWith(mockInterest.getId());
});

test('given any account, when getAll is called, then all interests are returned', async () => {
    const allInterests = [mockInterest];
    (interestDb.getAll as jest.Mock).mockResolvedValue(allInterests);

    const result = await interestService.getAll(mockAccount);

    expect(interestDb.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(allInterests);
});

test('given an admin account, when createInterest is called with a duplicate interest, then an error is thrown', async () => {
    (interestDb.getByName as jest.Mock).mockResolvedValue(mockInterest);

    await expect(interestService.createInterest(mockInterest, adminAccount)).rejects.toThrow(ServiceError);
    await expect(interestService.createInterest(mockInterest, adminAccount)).rejects.toThrow('Dublication of interest is not allowed');
});

test('given an admin account, when createInterest is called with a new interest, then interest is created', async () => {
    (interestDb.getByName as jest.Mock).mockResolvedValue(null);

    await interestService.createInterest(mockInterest, adminAccount);

    expect(interestDb.getByName).toHaveBeenCalledWith(mockInterest.getName());
    expect(interestDb.create).toHaveBeenCalledWith(mockInterest);
});
