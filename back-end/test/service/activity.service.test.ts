import { Account } from '../../model/account';
import { Activity } from '../../model/activity';
import activityDb from '../../repository/activity.db';
import eventDb from '../../repository/event.db';
import activityService from '../../service/activity.service';
import { Role } from '../../types';
import { ServiceError } from '../../service/service.error';

jest.mock('../../repository/activity.db');
jest.mock('../../repository/event.db');

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

const mockActivity = new Activity({
    id: 1,
    name: 'Cycling',
    type: 'Outdoor activity',
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

test('given a non-admin account, when getAllActivitiesForAdmin is called, then an error is thrown', async () => {
    await expect(activityService.getAllActivitiesForAdmin(mockAccount)).rejects.toThrow(ServiceError);
    await expect(activityService.getAllActivitiesForAdmin(mockAccount)).rejects.toThrow('Only admins can view all activities');
});

test('given an admin account, when getAllActivitiesForAdmin is called, then all activities are returned', async () => {
   
    const allActivities = [mockActivity];
    (activityDb.getAll as jest.Mock).mockResolvedValue(allActivities);
    (eventDb.getBySelectedActivity as jest.Mock).mockResolvedValue([]);

    const result = await activityService.getAllActivitiesForAdmin(adminAccount);

    expect(activityDb.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(allActivities.map(activity => ({
        ...activity.toSummary(),
        events: 0
    })));
});

test('given a non-admin account, when deleteActivity is called, then an error is thrown', async () => {
    await expect(activityService.deleteActivity(mockActivity.getId() ?? 0, mockAccount)).rejects.toThrow(ServiceError);
    await expect(activityService.deleteActivity(mockActivity.getId() ?? 0, mockAccount)).rejects.toThrow('Only admins can delete activities');
});

test('given an admin account, when deleteActivity is called with an activity in use, then an error is thrown', async () => {
    (activityDb.getById as jest.Mock).mockResolvedValue(mockActivity);
    (eventDb.getBySelectedActivity as jest.Mock).mockResolvedValue([{}]);

    await expect(activityService.deleteActivity(mockActivity.getId() ?? 0, adminAccount)).rejects.toThrow(ServiceError);
    await expect(activityService.deleteActivity(mockActivity.getId() ?? 0, adminAccount)).rejects.toThrow('Activity is in use');
});

test('given an admin account, when deleteActivity is called with a non-existent activity, then an error is thrown', async () => {
    (activityDb.getById as jest.Mock).mockResolvedValue(null);

    await expect(activityService.deleteActivity(999, adminAccount)).rejects.toThrow(ServiceError);
    await expect(activityService.deleteActivity(999, adminAccount)).rejects.toThrow('Activity not found');
});

test('given an admin account, when deleteActivity is called with a valid activity, then activity is deleted', async () => {
    (activityDb.getById as jest.Mock).mockResolvedValue(mockActivity);
    (eventDb.getBySelectedActivity as jest.Mock).mockResolvedValue([]);

    await activityService.deleteActivity(mockActivity.getId() ?? 0, adminAccount);

    expect(activityDb.getById).toHaveBeenCalledWith(mockActivity.getId());
    expect(eventDb.getBySelectedActivity).toHaveBeenCalledWith(mockActivity.getId());
    expect(activityDb.deleteById).toHaveBeenCalledWith(mockActivity.getId());
});

test('given any account, when getAllActivities is called, then all activities are returned', async () => {
    const allActivities = [mockActivity];
    (activityDb.getAll as jest.Mock).mockResolvedValue(allActivities);

    const result = await activityService.getAllActivities(mockAccount);

    expect(activityDb.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(allActivities);
});
