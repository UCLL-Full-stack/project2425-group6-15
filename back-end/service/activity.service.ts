import { Activity } from "../model/activity";
import activityDb from "../repository/activity.db";


const getAllActivities = async (): Promise<Activity[]> => activityDb.getAll();

export default { getAllActivities };