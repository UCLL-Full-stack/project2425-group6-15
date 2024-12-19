import { Account } from "../model/account";
import { Activity } from "../model/activity";
import activityDb from "../repository/activity.db";
import eventDb from "../repository/event.db";
import { ActivitySummary } from "../types";
import { ServiceError } from "./service.error";


const getAllActivities = async (currentAccount : Account): Promise<Activity[]> => {
    return activityDb.getAll()
};

const getAllActivitiesForAdmin = async (currentAccount : Account): Promise<ActivitySummary[]> => {
    if (currentAccount.getType() !== 'admin') {
        throw new ServiceError('Only admins can view all activities', 403);
    }
    const activities : Activity[] = await activityDb.getAll();
    let sumActivities = activities.map(activity => activity.toSummary());
    for (const activity of sumActivities) {
        const events = await eventDb.getBySelectedActivity(activity.id ?? 0);
        activity.events = events.length
    }
    return sumActivities;
}

const deleteActivity = async (id: number, currentAccount : Account): Promise<void> => {
    if (currentAccount.getType() !== 'admin') {
        throw new ServiceError('Only admins can delete activities', 403);
    }
    const activity = await activityDb.getById(id);
    if (!activity) {
        throw new ServiceError('Activity not found', 404);
    }
    const events = await eventDb.getBySelectedActivity(activity.getId() ?? 0);
    if (events.length > 0) {
        throw new ServiceError('Activity is in use', 403);
    }
    await activityDb.deleteById(id);
};

export default { getAllActivities,getAllActivitiesForAdmin, deleteActivity };