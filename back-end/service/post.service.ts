import { User} from '../model/user'; 
import { PostInput, PostSummary, UserInput, UserSummary } from '../types';
import { ServiceError } from './service.error';
import postdb from '../repository/post.db';
import userDb from '../repository/user.db';
import { Post } from '../model/post';
import activityDb from '../repository/activity.db';

const getPosts = async (): Promise<PostSummary[]> => {
    const posts = await postdb.getAll();
    if (!posts) {
        throw new ServiceError('Posts not found', 404);
    }
    const postSummaries: PostSummary[] = posts.map((post) => {
        return Post.toSummary(post);
    });
    return postSummaries;
}; 
const createPost = async (post: PostInput, currentUser : User): Promise<PostSummary> => {
    let creator = currentUser;
    const activityId = post.activity.getId();
    if (activityId === undefined) {
        throw new ServiceError('Activity ID is undefined', 400);
    }
    let acitivity = await activityDb.getById(activityId);
    if (!acitivity) {
        throw new ServiceError('Activity not found', 404);
    }
    
    const newPost = new Post({
        title: post.title,
        description: post.description,
        startDate: post.startDate,
        endDate: post.endDate,
        time: post.time,
        location: post.location,
        activity: acitivity,
        creator: creator,
        participants: [],
        peopleNeeded: post.peopleNeeded,
        preferredGender: post.preferredGender
    });
    const createdPost = await postdb.create(newPost);
    const postSummary: PostSummary = {
        id: createdPost.getId(),
        title: createdPost.getTitle(),
        description: createdPost.getDescription(),
        activity: createdPost.getActivity(),
        creator: User.toSummary(createdPost.getCreator()),
        participants: [],
        startDate: createdPost.getStartDate(),
        endDate: createdPost.getEndDate(),
        time: createdPost.getTime(),
        location: createdPost.getLocation(),
        peopleNeeded: createdPost.getPeopleNeeded(),
        preferredGender: createdPost.getPreferredGender()
    };
    return postSummary;
};


export default {
    getPosts,
    createPost
};